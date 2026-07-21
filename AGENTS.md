# AGENTS.md

`@govnotech/conventions` ships one preset per tool (Oxfmt / Oxlint / ESLint) per
stack (base / nest / vue / quasar), plus optional add-ons. This file is for
people and agents working **on** the package. Consumers are served by the
[README](./README.md) (a setup guide) — don't restate it here. The ubiquitous
language is in [CONTEXT.md](./CONTEXT.md); the load-bearing architectural
decisions are in [docs/adr/](./docs/adr/) — the map below says which to read
when.

## Architecture decisions

Four decisions are hard to reverse; each is one short ADR. Read the relevant one
before you touch the area it governs:

| ADR                                                                                              | Read before you…                                                                                              |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| [0001 — subpath exports](./docs/adr/0001-subpath-per-tool-exports.md)                            | add or remove an export or subpath; change `exports` / `typesVersions` in `package.json`, or a `tsdown` entry |
| [0002 — two-layer linting](./docs/adr/0002-two-layer-linting-oxlint-eslint.md)                   | add a rule, or move one between the linters; change the disable layer (`oxlintDisables`)                      |
| [0003 — bundled plugins, optional peers](./docs/adr/0003-plugins-bundled-clis-optional-peers.md) | move a plugin or CLI between `dependencies` and `peerDependencies`                                            |
| [0004 — oxlint presets as data](./docs/adr/0004-oxlint-presets-as-pure-data.md)                  | change how oxlint presets are typed or built (`satisfies` vs `defineConfig`), or the `/oxlint` import graph   |

## Commands

```bash
pnpm build          # tsdown → dist/ (the three subpath entries)
pnpm dev            # tsdown --watch
pnpm check          # run-p: check:format, check:code, check:spelling, check:types
pnpm fix            # run-s: fix:format, fix:code, fix:spelling-unused
pnpm release:check  # pnpm check && pnpm build && npm pack --dry-run
```

`check` fans the four `check:*` scripts out in parallel (`--continue-on-error`,
so all report); `check:code` is both linters. `fix` runs the `fix:*` scripts in
series. The package dogfoods its own presets — see the dogfood invariant below.

## Repo map

```
src/
  oxfmt/    base.ts (oxfmtBase)                        index.ts
  oxlint/   base.ts nest.ts vue.ts quasar.ts           merge.ts  (mergeOxlintConfig, OxlintAddon)
            plugins.ts (oxlintPluginVitest)            index.ts
  eslint/   base.ts nest.ts vue.ts quasar.ts           shared.ts (IGNORES, oxlintDisables)
            plugins.ts (EslintAddon + all add-ons)     modules.d.ts   index.ts
oxfmt.config.ts  oxlint.config.ts  eslint.config.ts    ← dogfood; import src leaf modules
tsdown.config.ts                                       ← builds the 3 subpath entries → dist/
```

Each tool's `index.ts` is the barrel behind its subpath. A stack preset is a
named export under a tool's subpath, **not** a new subpath; only a new _tool_
adds a subpath.

## Invariants

Things that will break the build or an editor pass, and that a well-meaning
"cleanup" would get wrong:

1. **Relative imports in `src/` carry the `.ts` extension.** Oxlint loads the
   `.ts` config through Node's native type-stripping loader, which needs
   explicit extensions (`allowImportingTsExtensions` in `tsconfig.json` permits
   them). Don't drop the extension when adding or moving imports.
2. **Root dogfood configs import `./src/**` leaf modules directly**, not the
   built package — so the IDE and CLI pick up source edits with no `pnpm build`.
   Don't "fix" `oxlint.config.ts` / `eslint.config.ts` / `oxfmt.config.ts` to
   import `@govnotech/conventions`.
3. **Only the local `.gitignore` is read** by Oxlint and ESLint, never a global
   one. A stray ignored directory that carries its own config (e.g. `tmp/`) can
   break traversal — ignore it in the repo's own `.gitignore`.
4. **`.vscode/settings.json` keeps every `codeActionsOnSave` at `explicit`**,
   not `always`. Type-aware ESLint must not run on autosave; on a manual save
   `explicit` behaves like `always`.
5. **The ESLint base/nest presets call `tseslint.config` despite its
   `@deprecated` tag**, with a scoped disable comment. ESLint core's
   `defineConfig` doesn't yet accept typescript-eslint's configs by type. Keep
   it until it does.
6. **Oxlint presets stay runtime-free** — type-only imports of `OxlintConfig`,
   `satisfies` not `defineConfig` ([ADR-0004](./docs/adr/0004-oxlint-presets-as-pure-data.md)).
   Never pull Oxlint's runtime into the `/oxlint` graph.

## Design notes

Why the curation is what it is. Per-rule reasoning lives in the JSDoc next to
each rule; this section is the philosophy the JSDoc applies.

**The bar for `base`.** A rule earns a place in a base preset only if it is
universal, low-noise, not a matter of taste, and safe to fail CI on with no
per-project tuning. Everything cool-but-opinionated or niche is an add-on or a
stack override instead. The reason is asymmetric cost: `base` is `error` for
every consumer, so a wrong rule breaks everyone at once and is awkward to
override downstream.

**The strictly-better twin.** Turn an add-on rule off against `base`/Oxlint only
when the base already runs a strictly more powerful analog — as with
`sonarjs/deprecation`, dropped because the type-aware
`@typescript-eslint/no-deprecated` subsumes it. We deliberately do **not** run a
full dedup audit (e.g. all 217 SonarJS rules against base): it is
disproportionate, the plugins version independently, and blunt de-duping risks
losing edge coverage.

| Choice                                                      | Why                                                                                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Oxlint categories: `correctness`, `suspicious`, `perf` only | `style` overlaps the formatter; `restriction` is a per-rule feature ban; `nursery` churns between releases                                   |
| `sort-imports` with `ignoreDeclarationSort`                 | Oxfmt owns import-statement order; Oxlint only sorts names inside `{ }`, and the rule isn't auto-fixable                                     |
| No `reportUnusedDisableDirectives` in base                  | ESLint-only disable comments read as "unused" to Oxlint and trip `--max-warnings 0`                                                          |
| Type-aware rules in ESLint, not Oxlint                      | `oxlint-tsgolint` is alpha ([ADR-0002](./docs/adr/0002-two-layer-linting-oxlint-eslint.md))                                                  |
| SonarJS is opt-in, not base                                 | 217 rules laced with hard opinions — cognitive-complexity, `todo-tag: error`, nested-ternary ban                                             |
| `sonarjs/deprecation: off`                                  | base already runs the type-aware `@typescript-eslint/no-deprecated` (strictly-better twin)                                                   |
| JSDoc = check-only, 13 rules, `mode: typescript`            | `recommended-typescript` forces `@param`/`@returns` that restate TS types; `no-types` bans types in JSDoc                                    |
| Regexp = `flat/recommended`, not `flat/all`                 | "strictest" means strictest _sensible_, not kitchen-sink `all` with stylistic noise                                                          |
| Vitest split across both linters                            | Oxlint runs the recommended set; the ESLint add-on adds only type-aware `unbound-method` / `prefer-vi-mocked`                                |
| Storybook = docs-only, not shipped                          | `eslint-plugin-storybook@10` hard-pins peer `storybook@^10`, chaining our releases to Storybook majors                                       |
| Jest removed entirely                                       | Vitest everywhere                                                                                                                            |
| Nest relaxes DI/decorator idioms, promotes async-safety     | else `strictTypeChecked` floods idiomatic Nest; `no-floating-promises` / `no-misused-promises` are raised to `error` as the high-value rules |
| Quasar = thin Vue extension (extra ignores only)            | Quasar ships no ESLint plugin; `eslint-plugin-vue` is its linter                                                                             |

## Extending

**Add an add-on.** Prefer Oxlint for anything syntactic. In
`src/oxlint/plugins.ts` add an `OxlintAddon` (`{ plugins, env, rules, … }`) if
the plugin has an Oxlint equivalent; in `src/eslint/plugins.ts` add an
`EslintAddon` — a single flat config on `.config` — for the type-aware rules
only. Re-export from the tool's `index.ts`. Consumers spread it and scope it:
`{ ...eslintPluginX.config, files: ['…'] }`. Add-ons are opt-in by definition.
Any plugin package a new add-on needs is bundled as a `dependency`, not a peer
([ADR-0003](./docs/adr/0003-plugins-bundled-clis-optional-peers.md)).

**Add a stack preset.** Oxlint: `mergeOxlintConfig(oxlintBase, { … })` in
`src/oxlint/<stack>.ts`, exporting the data object and a
`defineConfigOxlint<Stack>`. ESLint: a `defineConfigEslint<Stack>` in
`src/eslint/<stack>.ts` that ends with `...oxlintDisables(oxlint<Stack>)` then
`skipFormatting` — both last, always. Re-export both from the tool `index.ts`.
No `package.json` `exports`, `typesVersions`, or `tsdown` entry change: a stack
is a named export, not a subpath.

**Add or raise a rule.** Put it in `base` only if it clears the bar above;
otherwise it's an add-on or a stack override. If Oxlint can enforce it
(syntactic), do it there, not in ESLint. If it duplicates something Oxlint owns,
the disable layer will switch it off in ESLint — that's expected, not a bug
([ADR-0002](./docs/adr/0002-two-layer-linting-oxlint-eslint.md)).

**Add a new tool.** New `src/<tool>/` with an `index.ts`, plus a `package.json`
`exports` + `typesVersions` entry and a `tsdown` entry for the new subpath
([ADR-0001](./docs/adr/0001-subpath-per-tool-exports.md)).
