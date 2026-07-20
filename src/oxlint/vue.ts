import { oxlintBase } from './base'

export const oxlintVue = {
  ...oxlintBase,
  plugins: [...(oxlintBase.plugins ?? []), 'vue', 'vitest'],
  env: { browser: true },
}
