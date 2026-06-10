# @govnotech/conventions

Shared, opinionated code-style conventions for TypeScript projects.

Presets are exposed from `@govnotech/conventions/<key>` so the same package can
be used across all your projects.

## Table of Contents

- [Requirements](#requirements)
- [Presets](#presets)
- [1. Install](#1-install)
- [2. Configure EditorConfig](#2-configure-editorconfig)
- [3. Configure Oxfmt](#3-configure-oxfmt)
- [4. Add npm scripts](#4-add-npm-scripts)
- [5. Format the project](#5-format-the-project)
- [6. Configure IDEs](#6-configure-ides)
  - [VS Code](#vs-code)
  - [JetBrains](#jetbrains)
  - [Zed](#zed)
  - [Neovim](#neovim)
  - [Other editors](#other-editors)
- [7. Set up CI (optional)](#7-set-up-ci-optional)
  - [GitHub Actions](#github-actions)
  - [GitLab CI](#gitlab-ci)

## Requirements

- Node `>=22.12.0`
- pnpm for the examples; use your project’s package manager if different

## Presets

Presets are addressed by a key on the package subpath,
`@govnotech/conventions/<key>`:

| Key    | For                            |
| ------ | ------------------------------ |
| `base` | Plain TypeScript or JavaScript |
| `vue`  | Vue projects                   |

Use the key that matches your stack. The examples below use `base` so the
snippets work as-is; replace `base` with another key when needed.

## 1. Install

```bash
pnpm add -D @govnotech/conventions oxfmt
```

[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) is the formatter;
`@govnotech/conventions` provides the preset it reads.

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

# Oxfmt and Prettier won’t trim trailing whitespace inside template strings,
# but your editor might: https://prettier.io/docs/en/configuration#editorconfig
# trim_trailing_whitespace = true
```

## 3. Configure Oxfmt

Create `oxfmt.config.ts` at the repo root. Re-export the preset as-is:

```ts
export { oxfmt as default } from '@govnotech/conventions/base'
```

Or spread it to override specific options:

```ts
import { oxfmt } from '@govnotech/conventions/base'
import { defineConfig } from 'oxfmt'

export default defineConfig({
  ...oxfmt,

  // ...your overrides
})
```

## 4. Add npm scripts

Install `npm-run-all2` to run multiple scripts in parallel or series:

```bash
pnpm add -D npm-run-all2
```

Then add these scripts to `package.json`:

```json
{
  "scripts": {
    "check": "run-p --continue-on-error check:*",
    "check:format": "oxfmt --check",
    "fix": "run-s fix:*",
    "fix:format": "oxfmt --write"
  }
}
```

You can now run:

- `pnpm check` to run all checks in parallel
- `pnpm check:format` to check formatting only
- `pnpm fix` to run all fixes in series
- `pnpm fix:format` to fix formatting only

## 5. Format the project

Before adding CI, make the formatting pass explicit:

1. Commit the setup changes from steps 1-4: dependencies, config files, and npm
   scripts.
2. Run `pnpm fix:format`.
3. Run `pnpm check:format` to confirm the formatting pass is clean.
4. Review the diff and commit only the resulting formatting changes.

After that, CI can enforce formatting without introducing a knowingly failing
check.

## 6. Configure IDEs

Add only the editor configurations your team uses:

If formatting behaves differently on one machine, check that editor’s user-level
formatter settings do not override the project setup.

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
  "recommendations": ["EditorConfig.EditorConfig", "oxc.oxc-vscode"],
  "unwantedRecommendations": ["esbenp.prettier-vscode"]
}
```

Set up actions on save in `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "oxc.oxc-vscode",
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.format.oxc": "always"
  }
}
```

Check your VS Code User Settings for language-specific formatter overrides such
as `[typescript]`, `[json]`, or `[vue]`. These user-level overrides can take
precedence over the project-level `editor.defaultFormatter`, so formatting may
still run through another extension on some machines.

For large teams, prefer making the project settings explicit for the languages
your project formats:

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
`Settings > Plugins > Marketplace`, search for “Oxc”.

The plugin hooks into the built-in `Code > Reformat Code` actions and can
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

### Neovim

Via [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig):

```lua
vim.lsp.enable('oxfmt')
```

[conform.nvim](https://github.com/stevearc/conform.nvim) and
[coc.nvim](https://github.com/neoclide/coc.nvim) (`:CocInstall coc-oxc`) work
too.

### Other editors

Use your editor’s Oxc integration when available. Without an integration, pipe
files through the local CLI:

```bash
pnpm exec oxfmt --stdin-filepath src/foo.ts < src/foo.ts
```

## 7. Set up CI (optional)

Examples only — the real setup depends on your platform and existing pipeline.
Both examples cache dependencies, then run each `check:*` script as a separate
job.

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
        script: [format]
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

check:format:
  stage: check
  needs:
    - install
  script:
    - pnpm check:format

# ...
```

## License

MIT © Vova Revenko
