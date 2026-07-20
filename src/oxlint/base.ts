import { defineConfig } from 'oxlint'

export const oxlintBase = defineConfig({
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
  categories: { correctness: 'error' },
})
