import { defineConfig, type OxfmtConfig } from 'oxfmt'

/**
 * Keep the exported preset typed as `OxfmtConfig`
 *
 * Without the generic, declaration emit may widen literal options and break
 * downstream `defineConfig({ ...oxfmt })` overrides.
 */
export default defineConfig<OxfmtConfig>({
  arrowParens: 'avoid',
  printWidth: 80,
  quoteProps: 'consistent',
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
})
