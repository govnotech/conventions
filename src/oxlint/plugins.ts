import type { OxlintAddon } from './merge.ts'

/**
 * Vitest add-on — enables Oxlint's `vitest` plugin and its globals. Oxlint
 * covers the full recommended Vitest rule set; the ESLint Vitest add-on only
 * layers on the few type-aware rules Oxlint cannot do
 */
export const oxlintPluginVitest = {
  plugins: ['vitest'],
  env: { vitest: true },
} satisfies OxlintAddon
