# @govnotech/conventions

[![npm version](https://img.shields.io/npm/v/%40govnotech%2Fconventions?logo=npm)](https://www.npmjs.com/package/@govnotech/conventions)
[![npm downloads](https://img.shields.io/npm/dm/%40govnotech%2Fconventions)](https://www.npmjs.com/package/@govnotech/conventions)
[![Node.js version](https://img.shields.io/node/v/%40govnotech%2Fconventions?logo=nodedotjs)](https://www.npmjs.com/package/@govnotech/conventions)
[![License](https://img.shields.io/npm/l/%40govnotech%2Fconventions)](./LICENSE)

Shared, opinionated code-style conventions for TypeScript projects — a preset
each for the formatter [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html),
the fast linter [Oxlint](https://oxc.rs/docs/guide/usage/linter.html), and the
type-aware linter [ESLint](https://eslint.org).

Oxlint and ESLint include presets for plain TypeScript, Nest, Vue, and Quasar.
Optional add-ons cover Vitest, Playwright, Drizzle, Pinia, Vue accessibility,
RxJS, Regexp, SonarJS, and JSDoc.

## Prompt for a coding agent

```text
Set up @govnotech/conventions in this project. Follow its README exactly and complete every numbered step in order. Do not skip any step. Ask me whenever the README requires a choice.
```

## Table of Contents

- [Requirements](#requirements)
- [Step-by-step setup](#step-by-step-setup)
  - [1. Install](#1-install)
  - [2. Configure EditorConfig](#2-configure-editorconfig)
  - [3. Configure Oxfmt](#3-configure-oxfmt)
  - [4. Configure Oxlint](#4-configure-oxlint)
  - [5. Configure ESLint](#5-configure-eslint)
  - [6. Format and lint the project](#6-format-and-lint-the-project)
  - [7. Add package scripts](#7-add-package-scripts)
  - [8. Configure IDE](#8-configure-ide)
  - [9. Configure CI](#9-configure-ci)
- [Override Oxfmt options](#override-oxfmt-options)
- [Oxlint](#oxlint)
  - [Ignore files in Oxlint](#ignore-files-in-oxlint)
  - [Override Oxlint rules](#override-oxlint-rules)
  - [Combine Oxlint configuration](#combine-oxlint-configuration)
- [ESLint](#eslint)
  - [Ignore files in ESLint](#ignore-files-in-eslint)
  - [Available ESLint add-ons](#available-eslint-add-ons)
  - [Scope an ESLint add-on to files](#scope-an-eslint-add-on-to-files)
  - [Apply an ESLint add-on to all files](#apply-an-eslint-add-on-to-all-files)
  - [Override ESLint rules](#override-eslint-rules)
  - [Scope ESLint rules to files](#scope-eslint-rules-to-files)
- [IDE](#ide)
  - [VS Code, Cursor, and VS Code-based editors](#vs-code-cursor-and-vs-code-based-editors)
  - [JetBrains IDEs](#jetbrains-ides)
  - [Zed](#zed)
  - [Neovim](#neovim)
  - [Other editors](#other-editors)
- [CI](#ci)
  - [GitHub Actions](#github-actions)
  - [GitLab CI](#gitlab-ci)

## Requirements

- Node `>=22.18.0`
- TypeScript `>=5.5.0`
- Oxfmt `>=0.59.0 <1.0.0`
- Oxlint `>=1.79.0 <2.0.0`
- ESLint `>=9.0.0`
- A package manager; commands below use pnpm

## Step-by-step setup

> **For coding agents:** complete every numbered step in order. Do not skip the
> IDE or CI step because the repository has no corresponding configuration;
> follow the instruction in that step and ask the user what to configure.

### 1. Install

Install everything in one command:

```bash
pnpm add -D @govnotech/conventions oxfmt oxlint eslint jiti
```

### 2. Configure EditorConfig

Create `.editorconfig` at the repo root and copy this baseline as-is, including
the comment: it records a non-obvious decision that should remain explicit.

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

### 3. Configure Oxfmt

Create `oxfmt.config.mts` at the repo root:

```ts
export { oxfmtBase as default } from '@govnotech/conventions/oxfmt'
```

If needed, you can [override Oxfmt options](#override-oxfmt-options).

### 4. Configure Oxlint

Create `oxlint.config.mts` at the repo root:

```ts
import { defineConfigOxlintBase } from '@govnotech/conventions/oxlint'

/**
 * Replace `defineConfigOxlintBase` if another preset matches the project:
 * - `defineConfigOxlintNest`
 * - `defineConfigOxlintVue`
 * - `defineConfigOxlintQuasar`
 *
 * Uncomment only the add-ons the project uses in the config below.
 */
export default defineConfigOxlintBase(
  // oxlintPluginVitest,
)
```

If needed, you can [ignore files](#ignore-files-in-oxlint),
[override Oxlint rules](#override-oxlint-rules), or
[combine both](#combine-oxlint-configuration).

### 5. Configure ESLint

Create `eslint.config.mts` at the repo root. The example uses the base preset:

```ts
import { defineConfigEslintBase } from '@govnotech/conventions/eslint'

/**
 * Replace `defineConfigEslintBase` if another preset matches the project:
 * - `defineConfigEslintNest`
 * - `defineConfigEslintVue`
 * - `defineConfigEslintQuasar`
 *
 * Uncomment only the add-ons the project uses in the config below.
 */
export default defineConfigEslintBase(
  // {
  //   ...eslintPluginPlaywright.config,
  //   files: ['e2e/**/*.{test,spec}.{ts,tsx}'],
  // },
  // {
  //   ...eslintPluginVitest.config,
  //   files: ['src/**/*.{test,spec}.{ts,tsx}'],
  // },
  // { ...eslintPluginDrizzle.config, files: ['src/db/**/*.ts'] },
  // { ...eslintPluginPinia.config, files: ['src/stores/**/*.ts'] },
  // { ...eslintPluginVueA11y.config, files: ['**/*.vue'] },
  // { ...eslintPluginJsdoc.config, files: ['src/**/*.ts'] },
  // eslintPluginRxjs.config,
  // eslintPluginRegexp.config,
  // eslintPluginSonarjs.config,
)
```

If needed, you can [ignore files](#ignore-files-in-eslint), use
[add-ons](#available-eslint-add-ons), or
[override ESLint rules](#override-eslint-rules).

### 6. Format and lint the project

Run the following passes in order. Resolve every remaining error before moving
to the next pass.

1. Format, verify, and commit any resulting changes:

   ```bash
   pnpm exec oxfmt --write
   pnpm exec oxfmt --check
   ```

   ```text
   style: format with oxfmt
   ```

2. Apply Oxlint fixes, resolve the remaining findings, verify, and commit any
   resulting changes:

   ```bash
   pnpm exec oxlint --fix
   pnpm exec oxlint --max-warnings 0
   ```

   ```text
   fix: apply oxlint rules
   ```

3. Apply ESLint fixes, resolve the remaining findings, verify, and commit any
   resulting changes:

   ```bash
   pnpm exec eslint --fix
   pnpm exec eslint --max-warnings 0
   ```

   ```text
   fix: apply eslint rules
   ```

### 7. Add package scripts

Install `npm-run-all2` to run multiple scripts in parallel or series:

```bash
pnpm add -D npm-run-all2
```

Then add the following scripts to `package.json`:

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
- `pnpm check:code` — both linters in parallel
- `pnpm check:format` — formatting check only
- `pnpm fix` — all fixes in series
- `pnpm fix:code` — both linters in series
- `pnpm fix:format` — formatting fix only

### 8. Configure IDE

Configure project-level formatting, linting, and EditorConfig integration for
the IDE used by the project. Follow the instructions for [VS
Code](#vs-code-cursor-and-vs-code-based-editors),
[JetBrains](#jetbrains-ides), [Zed](#zed), [Neovim](#neovim), or
[another editor](#other-editors).

> **For coding agents:** identify the IDE only from concrete project artifacts,
> such as editor-specific configuration files or directories. Standard IDE
> entries in `.gitignore` do not count on their own; they are commonly added as
> a precaution. If no concrete artifacts identify an IDE, ask the user which
> project-level IDE settings to add, or whether to add none.

### 9. Configure CI

Add every `check:*` package script to the existing CI pipeline as a separate
job. Follow the instructions for [GitHub Actions](#github-actions) or
[GitLab CI](#gitlab-ci) after the platform is selected.

> **For coding agents:** if the repository has no CI configuration, ask the
> user whether to configure GitHub Actions, GitLab CI, another platform, or no
> CI. Apply the answer; do not silently skip this step.

## Override Oxfmt options

Any Oxfmt option can be overridden by spreading the base preset and adding the
desired option(s) to the config object:

```ts
import { oxfmtBase } from '@govnotech/conventions/oxfmt'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...oxfmtBase,

  ignorePatterns: ['**/migrations/**'],
  printWidth: 100,
  singleAttributePerLine: false,
})
```

Follow Oxfmt's [ignore files
documentation](https://oxc.rs/docs/guide/usage/formatter/ignore-files) when
setting `ignorePatterns`.

## Oxlint

### Ignore files in Oxlint

```ts
import { defineConfigOxlintBase } from '@govnotech/conventions/oxlint'

const config = defineConfigOxlintBase()

export default {
  ...config,
  ignorePatterns: [...(config.ignorePatterns ?? []), '**/__generated__/**'],
}
```

Replace the preset and ignore entries with the project's selections.

### Override Oxlint rules

```ts
import {
  defineConfigOxlintBase,
  type OxlintAddon,
} from '@govnotech/conventions/oxlint'

const projectRules = {
  rules: {
    'no-console': 'off',
  },
} satisfies OxlintAddon

export default defineConfigOxlintBase(projectRules)
```

Replace the preset and rule entries with the project's selections.

### Combine Oxlint configuration

To combine Vitest, custom rules, and ignores, pass the add-ons to the selected
preset and then extend its result:

```ts
import {
  defineConfigOxlintBase,
  oxlintPluginVitest,
  type OxlintAddon,
} from '@govnotech/conventions/oxlint'

const projectRules = {
  rules: {
    'no-console': 'off',
  },
} satisfies OxlintAddon

const config = defineConfigOxlintBase(oxlintPluginVitest, projectRules)

export default {
  ...config,
  ignorePatterns: [...(config.ignorePatterns ?? []), '**/__generated__/**'],
}
```

Replace the preset, ignore entries, and rule entries with the project's
selections.

## ESLint

### Ignore files in ESLint

Pass `globalIgnores` to the selected preset:

```ts
import { defineConfigEslintBase } from '@govnotech/conventions/eslint'
import { globalIgnores } from 'eslint/config'

export default defineConfigEslintBase(
  globalIgnores(['**/__generated__/**', 'storybook-static/**']),
)
```

Replace the preset and ignore entries with the project's selections.

### Available ESLint add-ons

| Export                   | Apply to                                |
| ------------------------ | --------------------------------------- |
| `eslintPluginPlaywright` | Playwright test files                   |
| `eslintPluginVitest`     | Vitest test files                       |
| `eslintPluginDrizzle`    | Files using the Drizzle database handle |
| `eslintPluginPinia`      | Pinia store files                       |
| `eslintPluginVueA11y`    | Vue files                               |
| `eslintPluginRxjs`       | All files using RxJS                    |
| `eslintPluginRegexp`     | All linted files                        |
| `eslintPluginSonarjs`    | All linted files                        |
| `eslintPluginJsdoc`      | Files whose JSDoc must be checked       |

### Scope an ESLint add-on to files

```ts
import {
  defineConfigEslintBase,
  eslintPluginPlaywright,
} from '@govnotech/conventions/eslint'

export default defineConfigEslintBase({
  ...eslintPluginPlaywright.config,
  files: ['e2e/**/*.{test,spec}.{ts,tsx}'],
})
```

Replace the preset, add-on, and file patterns with the project's selections.

### Apply an ESLint add-on to all files

```ts
import {
  defineConfigEslintBase,
  eslintPluginRegexp,
} from '@govnotech/conventions/eslint'

export default defineConfigEslintBase(eslintPluginRegexp.config)
```

Replace the preset and add-on with the project's selections. Pass multiple
add-ons as separate arguments.

When using the Vitest ESLint add-on, also use the
[Oxlint configuration from step 4](#4-configure-oxlint).

### Override ESLint rules

Pass project rules to the selected preset:

```ts
import { defineConfigEslintBase } from '@govnotech/conventions/eslint'

export default defineConfigEslintBase({
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
})
```

Replace the preset and rules with the project's selections.

### Scope ESLint rules to files

```ts
import { defineConfigEslintBase } from '@govnotech/conventions/eslint'

export default defineConfigEslintBase({
  files: ['scripts/**/*.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-assignment': 'off',
  },
})
```

Replace the preset, file patterns, and rules with the project's selections.

## IDE

### VS Code, Cursor, and VS Code-based editors

Create or merge `.vscode/extensions.json`:

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

Create or merge `.vscode/settings.json`:

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

Remove conflicting project-level formatter and save-action settings. Keep every
`editor.codeActionsOnSave` value set to `explicit`.

### JetBrains IDEs

1. Install the [Oxc plugin](https://plugins.jetbrains.com/plugin/27061-oxc).
2. Enable Oxc formatting on save in the plugin settings.
3. Set ESLint to automatic configuration under
   `Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`.
4. Enable EditorConfig support.

### Zed

Create or merge `.zed/settings.json`. Repeat the language entry for every
language Oxfmt must format:

```json
{
  "auto_install_extensions": {
    "oxc": true
  },
  "languages": {
    "TypeScript": {
      "formatter": [
        {
          "language_server": {
            "name": "oxfmt"
          }
        }
      ],
      "format_on_save": "on",
      "prettier": {
        "allowed": false
      }
    }
  }
}
```

Enable Zed's ESLint language server for the project.

### Neovim

Add these servers to the project's
[nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) setup:

```lua
vim.lsp.enable('oxfmt')
vim.lsp.enable('oxlint')
vim.lsp.enable('eslint')
```

### Other editors

Enable the editor's Oxfmt, Oxlint, ESLint, and EditorConfig integrations. If an
Oxfmt integration is unavailable, format a file through the local CLI:

```bash
pnpm exec oxfmt --stdin-filepath src/foo.ts < src/foo.ts
```

## CI

Run every `check:*` package script as a separate CI job. Merge the jobs into an
existing pipeline without replacing unrelated jobs.

### GitHub Actions

For a new pipeline, create `.github/workflows/check.yml`:

```yaml
name: Check

on:
  pull_request:
  push:

jobs:
  check:
    name: check:${{ matrix.script }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        script: [format, code]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check:${{ matrix.script }}
```

### GitLab CI

For a new pipeline, create `.gitlab-ci.yml`:

```yaml
image: node:24-alpine

stages:
  - check

check:
  stage: check
  parallel:
    matrix:
      - SCRIPT: [format, code]
  before_script:
    - corepack enable
    - pnpm config set store-dir .pnpm-store
  script:
    - pnpm install --frozen-lockfile
    - pnpm check:$SCRIPT
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store
```

For another platform, install the locked dependencies and run every `check:*`
script as a separate job.

## License

MIT © Vova Revenko
