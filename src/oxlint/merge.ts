import type { OxlintConfig } from 'oxlint'

/**
 * The subset of an Oxlint config an add-on may contribute.
 *
 * Add-ons only widen a preset — they enable plugins, globals, and rules; they
 * never replace the preset's categories, options, or ignore patterns
 */
export type OxlintAddon = Pick<
  OxlintConfig,
  'env' | 'globals' | 'overrides' | 'plugins' | 'rules' | 'settings'
>

/**
 * Merge a base Oxlint preset with any number of add-ons into one config object.
 *
 * `plugins` are deduplicated, `env`/`globals`/`settings`/`rules` shallow-merged
 * (later wins), and `overrides` are concatenated. Every other base field
 * (`categories`, `options`, `ignorePatterns`, …) is preserved as-is. Empty
 * results are omitted so the emitted config stays minimal
 */
export const mergeOxlintConfig = (
  base: OxlintConfig,
  ...addons: OxlintAddon[]
): OxlintConfig => {
  const plugins: OxlintConfig['plugins'] = [
    ...new Set([
      ...(base.plugins ?? []),
      ...addons.flatMap(addon => addon.plugins ?? []),
    ]),
  ]

  const env = Object.assign(
    {},
    base.env,
    ...addons.map(addon => addon.env),
  ) as NonNullable<OxlintConfig['env']>

  const globals = Object.assign(
    {},
    base.globals,
    ...addons.map(addon => addon.globals),
  ) as NonNullable<OxlintConfig['globals']>

  const settings = Object.assign(
    {},
    base.settings,
    ...addons.map(addon => addon.settings),
  ) as NonNullable<OxlintConfig['settings']>

  const rules = Object.assign(
    {},
    base.rules,
    ...addons.map(addon => addon.rules),
  ) as NonNullable<OxlintConfig['rules']>

  const overrides: OxlintConfig['overrides'] = [
    ...(base.overrides ?? []),
    ...addons.flatMap(addon => addon.overrides ?? []),
  ]

  return {
    ...base,
    plugins,
    ...(Object.keys(env).length > 0 && { env }),
    ...(Object.keys(globals).length > 0 && { globals }),
    ...(Object.keys(settings).length > 0 && { settings }),
    ...(Object.keys(rules).length > 0 && { rules }),
    ...(overrides.length > 0 && { overrides }),
  }
}
