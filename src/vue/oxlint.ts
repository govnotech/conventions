import base from '../base/oxlint'

export default {
  ...base,
  plugins: [...(base.plugins ?? []), 'vue', 'vitest'],
  env: { browser: true },
}
