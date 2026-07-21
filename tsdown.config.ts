import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    oxfmt: 'src/oxfmt/index.ts',
    oxlint: 'src/oxlint/index.ts',
    eslint: 'src/eslint/index.ts',
  },
  format: 'esm',
  dts: true,
  clean: true,
  outDir: 'dist',
})
