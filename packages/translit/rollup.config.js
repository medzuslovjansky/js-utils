import terser from '@rollup/plugin-terser';

// The IIFE bundle behind
// https://unpkg.com/@interslavic/utils/dist/transliterate/index.browser.min.js
// (see web-elements/examples/lang.html). packages/legacy copies it back to that
// path on build; the global name must stay `transliterate`.
// The old root bundle (dist/index.browser.min.js, 90 KB) had no consumers and is gone.
//
// Bundles what tsc already emitted, not the sources: `build` runs tsc first, and
// TypeScript 7 dropped the compiler API @rollup/plugin-typescript needs.
export default {
  input: 'dist/index.js',
  output: [
    {
      file: 'dist/index.browser.min.js',
      format: 'iife',
      name: 'transliterate',
      sourcemap: true,
    },
  ],
  plugins: [terser()],
};
