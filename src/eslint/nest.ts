import nestjs from '@darraghor/eslint-plugin-nestjs-typed'
import js from '@eslint/js'
import skipFormatting from 'eslint-config-prettier/flat'
import { globalIgnores } from 'eslint/config'
import tseslint, {
  type ConfigArray,
  type ConfigWithExtends,
} from 'typescript-eslint'

import { oxlintNest } from '../oxlint/nest.ts'
import { IGNORES, oxlintDisables } from './shared.ts'

/**
 * NestJS ESLint preset — the base type-aware layer plus
 * `@darraghor/eslint-plugin-nestjs-typed` (injectable/provider/DTO/Swagger
 * rules Oxlint has no equivalent for) and a relax layer for the decorator- and
 * DI-heavy idioms that otherwise flood under `strictTypeChecked`.
 *
 * Add `nestjs.configs.flatNoSwagger` yourself if the project has no
 * `@nestjs/swagger`. Async safety (`no-floating-promises`, `no-misused-
 * promises`) is promoted to error — the highest-value rules for Nest
 */
export const defineConfigEslintNest = (
  ...userConfigs: ConfigWithExtends[]
): ConfigArray =>
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- see base preset
  tseslint.config(
    { name: 'govnotech/nest/files', files: ['**/*.{ts,mts,cts}'] },

    globalIgnores(IGNORES),

    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    ...nestjs.configs.flatRecommended,

    {
      name: 'govnotech/nest/language-options',
      languageOptions: { parserOptions: { projectService: true } },
    },

    {
      name: 'govnotech/nest/rules',
      rules: {
        // Empty `@Module()` classes are the canonical Nest pattern
        '@typescript-eslint/no-extraneous-class': 'off',
        // `reflect-metadata` / DI / `ConfigService.get()` lean on `any`
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'warn',
        // Services are often `async` for interface conformance without `await`
        '@typescript-eslint/require-await': 'off',
        // Logger / string building over numbers & booleans is idiomatic
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          { allowBoolean: true, allowNumber: true },
        ],
        // Passing provider methods around trips this; keep it for real cases
        '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

        // The highest-value async-safety rules — promoted to error
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
      },
    },

    ...userConfigs,

    ...oxlintDisables(oxlintNest),
    skipFormatting,
  )
