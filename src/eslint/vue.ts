import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from '@vue/eslint-config-typescript'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginVue from 'eslint-plugin-vue'
import { globalIgnores } from 'eslint/config'
import type { Config, ConfigWithExtends } from 'typescript-eslint'

import { oxlintVue } from '../oxlint/vue.ts'
import { IGNORES, oxlintDisables } from './shared.ts'

/**
 * Vue ESLint preset — the strict Vue + type-aware layer for a Vue 3 app.
 *
 * Uses `eslint-plugin-vue`'s `flat/recommended` (attribute ordering, casing,
 * self-closing — stricter than `essential`) and `vueTsConfigs.strictTypeChecked`.
 * The `defineConfigWithVueTs` wrapper is required: it orders the Vue parser and
 * the TS configs correctly, which a flat array cannot express. As with the base
 * preset, the Oxlint-derived disable layer and `skipFormatting` stay last.
 *
 * Type-aware linting needs a tsconfig that covers the linted files; if
 * `strictTypeChecked` is too loud on untyped edges, drop to
 * `vueTsConfigs.recommended` in a local override
 */
export const defineConfigEslintVue = (
  ...userConfigs: ConfigWithExtends[]
): Config =>
  defineConfigWithVueTs(
    { name: 'govnotech/vue/files', files: ['**/*.{vue,ts,mts,cts,tsx}'] },

    globalIgnores([...IGNORES, '**/dist-ssr/**']),

    ...pluginVue.configs['flat/recommended'],
    vueTsConfigs.strictTypeChecked,
    vueTsConfigs.stylisticTypeChecked,

    {
      name: 'govnotech/vue/language-options',
      languageOptions: { parserOptions: { projectService: true } },
    },

    ...userConfigs,

    ...oxlintDisables(oxlintVue),
    skipFormatting,
  )
