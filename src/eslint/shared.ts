import type { Linter } from 'eslint'
import pluginOxlint from 'eslint-plugin-oxlint'
import type { OxlintConfig } from 'oxlint'

/**
 * Directories every preset ignores.
 *
 * Stack-specific ignores are added by the individual presets
 */
export const IGNORES = ['**/coverage/**', '**/dist/**', '**/node_modules/**']

type BridgeConfig = Parameters<typeof pluginOxlint.buildFromOxlintConfig>[0]

/**
 * Turn off every ESLint rule the given Oxlint preset already handles, derived
 * from the real preset object so the two linters can never drift. Must be
 * spread near the end of a flat config (before `skipFormatting`).
 *
 * The cast bridges `oxlint`'s `OxlintConfig` and the slightly older schema
 * `eslint-plugin-oxlint` types its parameter with — the runtime shape matches
 */
export const oxlintDisables = (config: OxlintConfig): Linter.Config[] =>
  pluginOxlint.buildFromOxlintConfig(config as unknown as BridgeConfig)
