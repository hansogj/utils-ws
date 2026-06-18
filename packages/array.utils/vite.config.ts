import { defineConfig } from 'vite';

// ESM (.mjs) + CJS (.cjs) per entry. Types come from tsc (build:ts).
// UMD `.js` per entry comes from webpack (build:umd) so the script-tag
// consumer in apps/web-js keeps working — Vite's library mode can only emit
// UMD for single-entry libs.
//
// Filename convention is harmonized across all libraries:
//   .mjs = ESM, .cjs = CJS, .js = UMD (no `"type": "module"` in package.json).
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: {
        index: 'src/index.ts',
        'defined/index': 'src/defined/index.ts',
        'onEmpty/index': 'src/onEmpty/index.ts',
        'flatMap/index': 'src/flatMap/index.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, name) => `${name}.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      // Polyfill modules (defined/polyfill.ts, onEmpty/onEmpty.ts) mutate
      // Array.prototype. Static analysis can't detect that's a side-effect,
      // and rolldown will drop them otherwise. Disable tree-shaking for our
      // own code — the package is tiny so the cost is negligible, and
      // downstream consumers still benefit from package.json `sideEffects`.
      treeshake: false,
    },
  },
});
