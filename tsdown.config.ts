import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/base/index.ts', 'src/vue/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  outDir: 'dist',
})
