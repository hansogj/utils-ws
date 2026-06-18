import { defineConfig } from 'vite';

// Single-entry library. ESM (.mjs) + CJS (.cjs). Types come from tsc (build:ts).
// UMD `dist/index.js` comes from webpack (build:umd) — filename convention
// harmonized across all libraries: .mjs = ESM, .cjs = CJS, .js = UMD.
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      output: {
        // Force `exports.default = X` in CJS even for default-only modules.
        // Without this, rollup/vite "helpfully" unwraps to `module.exports = X`
        // for default-only modules — but consumers like web-cs/web-ts do
        // `require('@hansogj/find-js').default` and would receive undefined.
        // Modules with named exports get `exports = { default, ... }` naturally;
        // this just makes the default-only case behave the same way.
        exports: 'named',
      },
    },
  },
});
