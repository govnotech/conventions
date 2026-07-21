import type { OxlintConfig } from 'oxlint'

import { mergeOxlintConfig, type OxlintAddon } from './merge.ts'

/**
 * Base Oxlint preset — the fast, syntactic layer shared by every stack.
 *
 * Oxlint runs first and owns everything that needs no type information;
 * type-aware rules are left to ESLint (see the `eslint` entry). `plugins`
 * overwrites Oxlint's defaults, so every wanted plugin is listed explicitly.
 *
 * Kept as plain data (`satisfies`, not `defineConfig`) so importing a preset
 * never pulls in Oxlint's runtime — the `oxlint` entry stays dependency-free
 */
export const oxlintBase = {
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'import', 'promise'],

  // Strict but sane: `style`/`restriction`/`nursery` stay off — `style`
  // overlaps the formatter, `restriction` is an opt-in-per-rule feature ban,
  // and `nursery` churns between releases. Reach into them per-rule instead
  categories: { correctness: 'error', perf: 'error', suspicious: 'error' },

  env: { builtin: true },

  rules: {
    // Oxfmt owns import-statement order; this only sorts names inside `{ }`.
    // Report-only (not auto-fixable), like ESLint's original
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
      },
    ],
  },
} satisfies OxlintConfig

export const defineConfigOxlintBase = (
  ...addons: OxlintAddon[]
): OxlintConfig => mergeOxlintConfig(oxlintBase, ...addons)
