import js from '@eslint/js'
import skipFormatting from 'eslint-config-prettier/flat'
import { globalIgnores } from 'eslint/config'
import tseslint, {
  type ConfigArray,
  type ConfigWithExtends,
} from 'typescript-eslint'

import { oxlintBase } from '../oxlint/base.ts'
import { IGNORES, oxlintDisables } from './shared.ts'

/**
 * Base ESLint preset — the type-aware layer for a plain TypeScript package.
 *
 * ESLint here owns only what Oxlint cannot: type-checked rules (via
 * `strictTypeChecked`, which needs `projectService`). `buildFromOxlintConfig`
 * then turns off every rule the {@link oxlintBase} preset already covers, so
 * the two linters never double-report — the disable set is derived from the
 * real Oxlint preset, so it can never drift. Both disable layers stay last.
 *
 * Pass extra flat configs (plugin add-ons, per-file overrides) as arguments;
 * they slot in before the disable layers
 */
export const defineConfigEslintBase = (
  ...userConfigs: ConfigWithExtends[]
): ConfigArray =>
  // `tseslint.config` is @deprecated in favor of ESLint's `defineConfig`, but
  // that helper's types don't yet accept typescript-eslint's configs cleanly.
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  tseslint.config(
    { name: 'govnotech/base/files', files: ['**/*.{ts,mts,cts,tsx}'] },

    globalIgnores(IGNORES),

    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    {
      name: 'govnotech/base/language-options',
      languageOptions: { parserOptions: { projectService: true } },
    },

    // Plain JS (config files, scripts) can't be type-checked — drop the
    // type-aware rules there so they don't error on "not in project"
    {
      name: 'govnotech/base/js-files',
      files: ['**/*.{js,mjs,cjs}'],
      extends: [tseslint.configs.disableTypeChecked],
    },

    ...userConfigs,

    ...oxlintDisables(oxlintBase),
    skipFormatting,
  )
