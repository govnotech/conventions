import { defineConfigEslintBase } from './src/eslint/base.ts'
import { eslintPluginJsdoc, eslintPluginSonarjs } from './src/eslint/plugins.ts'

export default defineConfigEslintBase(
  eslintPluginJsdoc.config,
  eslintPluginSonarjs.config,
)
