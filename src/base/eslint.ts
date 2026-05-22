import js from '@eslint/js'
import skipFormatting from 'eslint-config-prettier/flat'
import pluginOxlint from 'eslint-plugin-oxlint'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    name: 'govnotech/base/files-to-lint',
    files: ['**/*.{ts,mts,cts,tsx,js,mjs,cjs}'],
  },

  globalIgnores(['**/dist/**', '**/coverage/**']),

  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...pluginOxlint.configs['flat/recommended'],

  skipFormatting,
)
