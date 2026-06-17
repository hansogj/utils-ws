import { defineConfig } from 'vite';

// Single-entry library. ESM (.mjs) + CJS (.cjs) for the modern conditions in
// package.json `exports`; UMD `dist/abonnement.js` comes from webpack
// (build:umd) — filename preserved so the published 4.x script-tag path keeps
// working. Like maybe, this package does NOT set `"type": "module"` so the UMD
// at `dist/abonnement.js` stays interpretable as CJS + browser global.
//
// `@hansogj/array.utils` is a workspace dep with its own modern `exports` map;
// rollup picks `exports.import` → ESM `dist/index.js` automatically.
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/abonnement.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `abonnement.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      // Don't bundle the workspace dep — let the consumer resolve it via
      // package.json `dependencies` + their own bundler / Node resolution.
      external: ['@hansogj/array.utils'],
      output: {
        // Force `exports.X = …` (with __esModule:true) shape so consumers can
        // safely do `require('@hansogj/abonnement-js').Abonnement`. Same fix
        // as #37 — applied preemptively even though this package has named
        // exports today.
        exports: 'named',
      },
    },
  },
});
