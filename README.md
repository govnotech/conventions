# @govnotech/conventions

Shared, opinionated code-style conventions for TypeScript projects — a preset
each for the formatter ([Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)),
the fast linter ([Oxlint](https://oxc.rs/docs/guide/usage/linter.html)), and the
type-aware linter ([ESLint](https://eslint.org)), imported from a subpath per
tool: `/oxfmt`, `/oxlint`, `/eslint`.

Oxlint does everything syntactic; ESLint adds only the type-aware rules Oxlint
can't, wired so the two never double-report. Each linter has a **preset** per
stack (`base`, `nest`, `vue`, `quasar`) — pick one — plus optional **add-ons**
(Playwright, Vitest, Drizzle, …) you layer on. Every ESLint plugin the presets
use is bundled — no plugin packages to install or version yourself.

## Table of Contents

- [Requirements](#requirements)
- [Commit plan](#commit-plan)
- [1. Install](#1-install)
- [2. Configure EditorConfig](#2-configure-editorconfig)
- [3. Configure Oxfmt](#3-configure-oxfmt)
- [4. Configure Oxlint](#4-configure-oxlint)
- [5. Configure ESLint](#5-configure-eslint)
- [6. Format and lint the project](#6-format-and-lint-the-project)
- [7. Add npm scripts](#7-add-npm-scripts)
- [8. Configure IDEs](#8-configure-ides)
  - [VS Code](#vs-code)
  - [JetBrains](#jetbrains)
  - [Zed](#zed)
  - [Neovim](#neovim)
  - [Other editors](#other-editors)
- [9. Set up CI (optional)](#9-set-up-ci-optional)
  - [GitHub Actions](#github-actions)
  - [GitLab CI](#gitlab-ci)

## Requirements

- Node `>=22.18.0`
- Oxfmt `>=0.59.0`
- Oxlint `>=1.69.0`
- ESLint `>=9`, TypeScript `>=5.5` — for the type-aware ESLint layer
- pnpm for the examples; use your project’s package manager if different

Adopt only the tools you want — the sections are independent. A formatter-only
project skips steps 4 and 5 (Oxlint and ESLint).

## Commit plan

When adopting these conventions in an existing project, each commit should be
atomic and leave the project in a valid state. We recommend this split:

1. Steps 1-5: setup commit — installs and config files. No checks run yet.
2. Step 6: one commit per pass, in order — formatting, then Oxlint fixes, then
   ESLint fixes. Each pass is a clean, atomic diff.
3. Steps 7-9: follow-up commits, when needed.

This avoids enabling a check before the pass it guards is clean.

## 1. Install

```bash
pnpm add -D @govnotech/conventions oxfmt oxlint eslint jiti
```

- `@govnotech/conventions` bundles every ESLint plugin the presets use — you
  don’t install those yourself.
- `oxfmt`, `oxlint`, and `eslint` are the CLIs you run. `jiti` lets ESLint load a
  TypeScript `eslint.config.mts`. `typescript` is assumed already present — the
  ESLint layer is type-aware.
- Using only one tool? Install only its CLI (e.g. `oxfmt` alone).

## 2. Configure EditorConfig

Create `.editorconfig` at the repo root and copy this baseline as-is. The
commented `trim_trailing_whitespace` line is intentional because formatter and
editor behavior differ here.

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80

# Oxfmt and Prettier won't trim trailing whitespace inside template strings,
# but your editor might: https://prettier.io/docs/en/configuration#editorconfig
# trim_trailing_whitespace = true
```

## 3. Configure Oxfmt

Create `oxfmt.config.mts` at the repo root. Re-export the preset as-is:

```ts
export { oxfmtBase as default } from '@govnotech/conventions/oxfmt'
```

Or spread it to override specific options:

```ts
import { oxfmtBase } from '@govnotech/conventions/oxfmt'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...oxfmtBase,

  // ...your overrides
})
```

## 4. Configure Oxlint

Create `oxlint.config.mts` at the repo root. Keep **one** preset and only the
add-ons your project uses:

```ts
import {
  // Presets — keep ONE:
  defineConfigOxlintBase, // plain TypeScript package / library
  // defineConfigOxlintNest,   // NestJS backend
  // defineConfigOxlintVue,    // Vue 3
  // defineConfigOxlintQuasar, // Quasar

  // Add-ons — keep only what you use:
  oxlintPluginVitest, // Vitest tests
} from '@govnotech/conventions/oxlint'

export default defineConfigOxlintBase(oxlintPluginVitest)
```

Oxlint owns everything that needs no type information. Add-ons merge into the
single config object, so they take no file scoping. With no add-ons, a bare
re-export works too:

```ts
export { oxlintBase as default } from '@govnotech/conventions/oxlint'
```

## 5. Configure ESLint

Create `eslint.config.mts` at the repo root. Same shape — one preset, only the
add-ons your stack uses:

```ts
import {
  // Presets — keep ONE:
  defineConfigEslintBase, // plain TypeScript package / library
  // defineConfigEslintNest,   // NestJS backend
  // defineConfigEslintVue,    // Vue 3
  // defineConfigEslintQuasar, // Quasar

  // Add-ons — keep only what your stack uses:
  eslintPluginPlaywright, // e2e tests
  eslintPluginVitest, // unit tests (type-aware rules on top of Oxlint)
  eslintPluginDrizzle, // Drizzle ORM (backend)
  eslintPluginPinia, // Pinia stores (vue/quasar)
  eslintPluginVueA11y, // accessibility in Vue templates
  eslintPluginRxjs, // RxJS (nest)
  eslintPluginRegexp, // regex correctness
  eslintPluginSonarjs, // bug detection
  eslintPluginJsdoc, // JSDoc hygiene
} from '@govnotech/conventions/eslint'

export default defineConfigEslintBase(
  // An add-on’s `.config` is one flat config: pass it directly, or spread it
  // with `files` to scope it.
  {
    ...eslintPluginPlaywright.config,
    files: ['e2e/**/*.{test,spec}.{ts,tsx}'],
  },
  { ...eslintPluginVitest.config, files: ['src/**/*.{test,spec}.{ts,tsx}'] },
  { ...eslintPluginDrizzle.config, files: ['src/**/*.ts'] },
  { ...eslintPluginPinia.config, files: ['src/stores/**/*.ts'] },
  { ...eslintPluginVueA11y.config, files: ['**/*.vue'] },
  { ...eslintPluginJsdoc.config, files: ['src/**/*.ts'] },

  // No scoping — apply to every file the preset lints:
  eslintPluginRxjs.config,
  eslintPluginRegexp.config,
  eslintPluginSonarjs.config,
)
```

The preset automatically turns off every rule the matching Oxlint preset already
covers, so the two linters never report the same thing twice.

**Type-aware.** These presets lint with type information (`projectService` is
built in — no manual `parserOptions.project`), so your `tsconfig.json` must cover
the files being linted. If the strict defaults are too loud on untyped edges,
relax individual rules with an override config:

```ts
export default defineConfigEslintBase({
  rules: { '@typescript-eslint/no-unsafe-assignment': 'off' },
})
```

## 6. Format and lint the project

Run each pass and fix in place, before wiring up scripts or CI:

```bash
pnpm exec oxfmt --write
pnpm exec oxlint --fix
pnpm exec eslint --fix
```

Then confirm each pass is clean:

```bash
pnpm exec oxfmt --check
pnpm exec oxlint --max-warnings 0
pnpm exec eslint --max-warnings 0
```

Doing this first means the scripts and CI you add next don’t introduce a
knowingly failing check.

## 7. Add npm scripts

Install `npm-run-all2` to run multiple scripts in parallel or series:

```bash
pnpm add -D npm-run-all2
```

Then add these scripts to `package.json`:

```json
{
  "scripts": {
    "lint:ox": "oxlint --max-warnings 0",
    "lint:es": "eslint --max-warnings 0 --cache",
    "check": "run-p --continue-on-error check:*",
    "check:code": "run-p --continue-on-error lint:*",
    "check:format": "oxfmt --check",
    "fix": "run-s fix:*",
    "fix:code": "run-s \"lint:ox --fix\" \"lint:es --fix\"",
    "fix:format": "oxfmt --write"
  }
}
```

You can now run:

- `pnpm check` — run all checks in parallel
- `pnpm check:code` — both linters (`lint:ox` + `lint:es`) in parallel
- `pnpm check:format` — formatting check only
- `pnpm fix` — all fixes in series
- `pnpm fix:code` — both linters in series
- `pnpm fix:format` — formatting fix only

## 8. Configure IDEs

Add only the editor configurations your team uses. The Oxc integration reports
both Oxfmt and Oxlint; ESLint has a first-class extension in every major editor.

User-level editor settings can still override project setup.

Agent note: before adding IDE-specific settings, look for clear project
artifacts that identify the IDEs in use. If there are none, ask the user which
IDE configs to add.

- [VS Code](#vs-code)
- [JetBrains](#jetbrains)
- [Zed](#zed)
- [Neovim](#neovim)
- [Other editors](#other-editors)

### VS Code

Also applies to Cursor and other VS Code–based editors — the
[Oxc extension](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)
is published to both the Visual Studio Marketplace and
[Open VSX](https://open-vsx.org/extension/oxc/oxc-vscode).

Recommend the extensions and discourage Prettier as the project formatter in
`.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "EditorConfig.EditorConfig",
    "oxc.oxc-vscode"
  ],
  "unwantedRecommendations": ["esbenp.prettier-vscode"]
}
```

Set up actions on save in `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.oxc": "explicit",
    "source.fixAll.eslint": "explicit",
    "source.format.oxc": "explicit"
  },
  "search.exclude": {
    "**/coverage": true,
    "**/dist": true,
    "**/pnpm-lock.yaml": true
  }
}
```

Prefer removing project-level language-specific `editor.defaultFormatter`
overrides such as `[typescript]`, `[json]`, or `[vue]` when they only repeat or
conflict with the shared formatter. A single project-level
`editor.defaultFormatter` is easier to maintain.

If formatting behaves differently on one machine, check that developer’s VS Code
User Settings for language-specific formatter overrides. User-level overrides
can take precedence over project settings.

For large or open-source teams, prefer making the project settings explicit for
the languages your project formats:

```jsonc
{
  // ...the settings from the previous example
  "[typescript]": {
    "editor.defaultFormatter": "oxc.oxc-vscode",
  },
  "[json]": {
    "editor.defaultFormatter": "oxc.oxc-vscode",
  },
  "[vue]": {
    "editor.defaultFormatter": "oxc.oxc-vscode",
  },
  // ...other languages your project formats
}
```

### JetBrains

For IntelliJ IDEA, WebStorm, and other JetBrains IDEs. Install the
[Oxc plugin](https://plugins.jetbrains.com/plugin/27061-oxc):
`Settings > Plugins > Marketplace`, search for “Oxc”. ESLint is supported
natively under `Settings > Languages & Frameworks > JavaScript > Code Quality
Tools > ESLint` (use the automatic configuration).

The Oxc plugin hooks into the built-in `Code > Reformat Code` actions and can
format on save — enable it in the plugin settings.

### Zed

Install the [Oxc extension](https://zed.dev/extensions/oxc), or let it
auto-install via `.zed/settings.json`. Set `oxfmt` as the formatter there:

```json
{
  "auto_install_extensions": { "oxc": true },
  "languages": {
    "TypeScript": {
      "formatter": [{ "language_server": { "name": "oxfmt" } }],
      "format_on_save": "on",
      "prettier": { "allowed": false }
    }
  }
}
```

Repeat the `languages` entry for each language Oxfmt should format —
`JavaScript`, `TSX`, `JSON`, `Vue.js`, etc. See the
[full example](https://github.com/oxc-project/oxc-zed/tree/main/examples/oxfmt).
Zed’s built-in ESLint integration picks up the flat config automatically.

### Neovim

Via [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig):

```lua
vim.lsp.enable('oxfmt')
vim.lsp.enable('oxlint')
vim.lsp.enable('eslint')
```

[conform.nvim](https://github.com/stevearc/conform.nvim) and
[coc.nvim](https://github.com/neoclide/coc.nvim) (`:CocInstall coc-oxc`) work
too.

### Other editors

Use your editor’s Oxc and ESLint integrations when available. Without one, pipe
files through the local CLI:

```bash
pnpm exec oxfmt --stdin-filepath src/foo.ts < src/foo.ts
```

## 9. Set up CI (optional)

Examples only — the real setup depends on your platform and existing pipeline.
Both examples cache dependencies, then run each `check:*` script as a separate
job. ESLint’s type-aware pass needs the project’s types available; in a monorepo
that may mean building dependencies first.

- [GitHub Actions](#github-actions)
- [GitLab CI](#gitlab-ci)

### GitHub Actions

`.github/actions/setup/action.yml`:

```yaml
name: Setup
description: Set up pnpm and Node, then install dependencies
runs:
  using: composite
  steps:
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 24
    - uses: actions/cache@v4
      with:
        path: node_modules
        key: node-modules-${{ hashFiles('pnpm-lock.yaml') }}
    - run: pnpm install --frozen-lockfile
      shell: bash
```

`.github/workflows/ci.yml`:

```yaml
# ...

jobs:
  install:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup

  check:
    needs: install
    name: check:${{ matrix.script }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        script: [format, code]
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup
      - run: pnpm check:${{ matrix.script }}

  # ...
```

### GitLab CI

`.gitlab-ci.yml`:

```yaml
# ...

stages:
  - deps
  - check
  # ...

default:
  image: node:24-alpine
  before_script:
    - corepack enable
    - corepack prepare --activate
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - node_modules
    policy: pull

install:
  stage: deps
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - node_modules
    policy: pull-push
  script:
    - pnpm install --frozen-lockfile

check:
  stage: check
  needs:
    - install
  parallel:
    matrix:
      - SCRIPT: [format, code]
  script:
    - pnpm check:$SCRIPT

# ...
```

## License

MIT © Vova Revenko
