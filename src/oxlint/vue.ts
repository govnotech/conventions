import type { OxlintConfig } from 'oxlint'

import { oxlintBase } from './base.ts'
import { mergeOxlintConfig, type OxlintAddon } from './merge.ts'

/**
 * Vue Oxlint preset — {@link oxlintBase} plus the `vue` plugin and browser
 * globals. Vitest is opt-in via the `oxlintPluginVitest` add-on
 */
export const oxlintVue = mergeOxlintConfig(oxlintBase, {
  plugins: ['vue'],
  env: { browser: true },
})

export const defineConfigOxlintVue = (...addons: OxlintAddon[]): OxlintConfig =>
  mergeOxlintConfig(oxlintVue, ...addons)
