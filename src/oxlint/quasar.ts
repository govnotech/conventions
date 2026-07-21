import type { OxlintConfig } from 'oxlint'

import { mergeOxlintConfig, type OxlintAddon } from './merge.ts'
import { oxlintVue } from './vue.ts'

/**
 * Quasar Oxlint preset — the {@link oxlintVue} rule surface plus Quasar's
 * generated / per-mode directories in `ignorePatterns`. That is the only
 * genuinely Quasar-specific delta; everything else is inherited from Vue
 */
export const oxlintQuasar: OxlintConfig = {
  ...oxlintVue,
  env: { ...oxlintVue.env, builtin: true },
  ignorePatterns: [
    '**/.claude/worktrees/',
    '**/node_modules/',
    'dist/',
    '.quasar/',
    'quasar.config.*.temporary.compiled*',
    'src-capacitor/',
    'src-cordova/',
    'src-bex/',
    'src-electron/',
    'src-pwa/',
    'src-ssr/',
    'src/router/typed-router.d.ts',
  ],
}

export const defineConfigOxlintQuasar = (
  ...addons: OxlintAddon[]
): OxlintConfig => mergeOxlintConfig(oxlintQuasar, ...addons)
