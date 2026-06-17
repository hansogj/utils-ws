import { defineConfig } from 'vite';

// Single-entry library. ESM (.js) + CJS (.cjs). Types come from tsc (build:ts).
// UMD (`dist/index.umd.js`) comes from webpack (build:umd) so the script-tag
// consumer in apps/web-js still works.
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
  },
});
