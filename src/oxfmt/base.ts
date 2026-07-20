import { defineConfig, type OxfmtConfig } from 'oxfmt'

/**
 * Keep the exported preset typed as `OxfmtConfig`
 *
 * Without the generic, declaration emit may widen literal options and break
 * downstream `defineConfig({ ...oxfmtBase })` overrides
 */
export const oxfmtBase = defineConfig<OxfmtConfig>({
  arrowParens: 'avoid',
  printWidth: 80,
  quoteProps: 'consistent',
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  sortImports: {
    customGroups: [
      {
        groupName: '$foundation',
        elementNamePattern: ['{~/,@/}{core,shared}', '{~/,@/}{core,shared}/**'],
      },
    ],
    groups: [
      'builtin',
      'external',
      '$foundation',
      ['internal', 'subpath'],
      'parent',
      { newlinesBetween: false },
      'sibling',
      { newlinesBetween: false },
      'index',
      'style',
      'unknown',
    ],
  },
})
