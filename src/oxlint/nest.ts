import type { OxlintConfig } from 'oxlint'

import { oxlintBase } from './base.ts'
import { mergeOxlintConfig, type OxlintAddon } from './merge.ts'

/**
 * NestJS Oxlint preset — {@link oxlintBase} plus Node globals and the `node`
 * plugin. Type-aware and Nest-specific rules live in the ESLint layer
 */
export const oxlintNest = mergeOxlintConfig(oxlintBase, {
  plugins: ['node'],
  env: { node: true },
})

export const defineConfigOxlintNest = (
  ...addons: OxlintAddon[]
): OxlintConfig => mergeOxlintConfig(oxlintNest, ...addons)
