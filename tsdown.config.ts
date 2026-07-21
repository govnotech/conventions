import { defineConfig } from 'tsdown'

export default defineConfig({
  // One entry per tool → one subpath each; no bare `.` barrel. See ADR-0001
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
