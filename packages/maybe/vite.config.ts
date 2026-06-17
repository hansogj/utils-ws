import { defineConfig } from 'vite';

// Single-entry library. ESM (.mjs) + CJS (.cjs). Types come from tsc (build:ts).
// UMD `dist/maybe.js` comes from webpack (build:umd) — the existing filename is
// preserved so the published 2.x script-tag path keeps working unchanged.
//
// We do NOT set `"type": "module"` in package.json for this package, precisely
// so `dist/maybe.js` can remain a UMD bundle (interpretable as both CJS and
// browser global). Hence the explicit `.mjs` for ESM and `.cjs` for CJS.
export default defineConfig({
  build: {
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    lib: {
      entry: 'src/maybe.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `maybe.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
  },
});
