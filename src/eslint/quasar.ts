import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
import type { Config, ConfigWithExtends } from 'typescript-eslint'

import { oxlintQuasar } from '../oxlint/quasar.ts'
import { oxlintDisables } from './shared.ts'

/**
 * Quasar ESLint preset — the Vue preset's rule surface with Quasar's generated
 * and per-mode directories ignored. Quasar has no ESLint plugin of its own;
 * `eslint-plugin-vue` is its recommended linter, so this only differs from the
 * Vue preset in what it ignores
 */
export const defineConfigEslintQuasar = (
  ...userConfigs: ConfigWithExtends[]
): Config =>
  defineConfigWithVueTs(
    { name: 'govnotech/quasar/files', files: ['**/*.{vue,ts,mts,cts,tsx}'] },

    globalIgnores([
      '**/node_modules/**',
      '**/dist/**',
      '.quasar/**',
      'src-capacitor/**',
      'src-cordova/**',
      'src-bex/**',
      'src-electron/**',
      'src-pwa/**',
      'src-ssr/**',
      '**/quasar.config.*.temporary.compiled*',
      '**/src/router/typed-router.d.ts',
    ]),

    ...pluginVue.configs['flat/recommended'],
    vueTsConfigs.strictTypeChecked,
    vueTsConfigs.stylisticTypeChecked,

    {
      name: 'govnotech/quasar/language-options',
      languageOptions: { parserOptions: { projectService: true } },
    },

    ...userConfigs,

    ...oxlintDisables(oxlintQuasar),
    skipFormatting,
  )
