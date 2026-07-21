import pluginVitest from '@vitest/eslint-plugin'
import pluginDrizzle from 'eslint-plugin-drizzle'
import pluginJsdoc from 'eslint-plugin-jsdoc'
import pluginPinia from 'eslint-plugin-pinia'
import pluginPlaywright from 'eslint-plugin-playwright'
import { configs as regexpConfigs } from 'eslint-plugin-regexp'
import pluginRxjs from 'eslint-plugin-rxjs-x'
import pluginSonarjs from 'eslint-plugin-sonarjs'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import type { ConfigWithExtends } from 'typescript-eslint'

/**
 * An optional ESLint add-on: a single flat config exposed as `.config`, ready
 * to spread into a `defineConfigEslint*` preset. Scope it to the files it
 * applies to, e.g. `{ ...eslintPluginPlaywright.config, files: ['e2e/**'] }`.
 *
 * The explicit type annotation on every add-on is deliberate: it keeps the
 * emitted `.d.ts` from referencing un-nameable internal plugin types
 */
export interface EslintAddon {
  config: ConfigWithExtends
}

/**
 * Playwright — end-to-end test rules. Scope to your e2e directory
 */
export const eslintPluginPlaywright: EslintAddon = {
  config: pluginPlaywright.configs['flat/recommended'],
}

/**
 * Vitest — only the type-aware rules Oxlint's `vitest` plugin can't do. Do the
 * rest in Oxlint via `oxlintPluginVitest`. Scope to your test files
 */
export const eslintPluginVitest: EslintAddon = {
  config: {
    name: 'govnotech/plugin/vitest',
    plugins: { vitest: pluginVitest },
    settings: { vitest: { typecheck: true } },
    rules: {
      'vitest/unbound-method': 'error',
      'vitest/prefer-vi-mocked': 'error',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
}

/**
 * Drizzle ORM — require `.where()` on `.delete()`/`.update()`. `drizzleObjectName`
 * targets the `db` handle so non-Drizzle `.delete()` (Map/Set) isn't flagged;
 * override it if your handle is named differently. Scope to your db files
 */
export const eslintPluginDrizzle: EslintAddon = {
  config: {
    name: 'govnotech/plugin/drizzle',
    plugins: { drizzle: pluginDrizzle },
    rules: {
      'drizzle/enforce-delete-with-where': [
        'error',
        { drizzleObjectName: ['db'] },
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        { drizzleObjectName: ['db'] },
      ],
    },
  },
}

/**
 * Pinia — store hygiene (setup-store returns, unique ids). Scope to stores
 */
export const eslintPluginPinia: EslintAddon = {
  config: pluginPinia.configs['all-flat'] as unknown as ConfigWithExtends,
}

/**
 * Vue accessibility — fills the a11y gap Oxlint's JSX-only `jsx-a11y` can't
 * cover for Vue templates. Already scoped to `.vue` by the plugin
 */
export const eslintPluginVueA11y: EslintAddon = {
  config: {
    name: 'govnotech/plugin/vuejs-accessibility',
    plugins: { 'vuejs-accessibility': pluginVueA11y },
    rules: (
      pluginVueA11y.configs['flat/recommended'] as ConfigWithExtends[]
    ).find(entry => entry.rules)?.rules,
  },
}

/**
 * RxJS — subscription / leak correctness for RxJS-heavy code (e.g. Nest)
 */
export const eslintPluginRxjs: EslintAddon = {
  config: pluginRxjs.configs.strict,
}

/**
 * Regexp — regex correctness & performance bugs Oxlint can't see
 */
export const eslintPluginRegexp: EslintAddon = {
  config: regexpConfigs['flat/recommended'],
}

const sonarjsRecommended = pluginSonarjs.configs
  ?.recommended as unknown as ConfigWithExtends

/**
 * SonarJS — bug detection (duplicate branches, cognitive complexity, …).
 *
 * `sonarjs/deprecation` is turned off: the base preset already runs the
 * type-aware `@typescript-eslint/no-deprecated`, which covers the same ground
 * more precisely. Disabling it here keeps the two from double-reporting
 */
export const eslintPluginSonarjs: EslintAddon = {
  config: {
    ...sonarjsRecommended,
    name: 'govnotech/plugin/sonarjs',
    rules: {
      ...sonarjsRecommended.rules,
      'sonarjs/deprecation': 'off',
    },
  },
}

/**
 * JSDoc — quiet hygiene only. Keeps the JSDoc you write honest (tag typos,
 * `@param` names in sync with the signature, `@returns` matching a real return)
 * without forcing you to write JSDoc and without duplicating the type system —
 * `no-types` bans types in JSDoc, since TypeScript owns them.
 *
 * The plugin's `recommended-typescript` config is deliberately not used: it
 * forces `@param`/`@returns`/descriptions, which just restate the signature in
 * TypeScript. For project-specific custom tags, extend `check-tag-names`'s
 * `definedTags` in your own config
 */
export const eslintPluginJsdoc: EslintAddon = {
  config: {
    name: 'govnotech/plugin/jsdoc',
    plugins: { jsdoc: pluginJsdoc },
    settings: { jsdoc: { mode: 'typescript' } },
    rules: {
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'error',
      'jsdoc/empty-tags': 'error',
      'jsdoc/escape-inline-tags': 'error',
      'jsdoc/multiline-blocks': 'error',
      'jsdoc/no-defaults': 'error',
      'jsdoc/no-multi-asterisks': 'error',
      'jsdoc/no-types': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-yields-check': 'error',
      'jsdoc/tag-lines': 'error',
    },
  },
}
