const path = require('node:path');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const typescript = require('@rollup/plugin-typescript');

const entry = (process.env.ENTRY_POINT || '.');
const name = (process.env.ENTRY_POINT || 'interslavic_utils');

module.exports = {
  input: path.join('src', entry, 'index.ts'),
  output: [
    {
      file: path.join('dist', entry, 'index.browser.min.js'),
      format: 'iife',
      name,
      sourcemap: true,
    },
  ],
  plugins: [
    json(),
    typescript({
      compilerOptions: {
        module: 'esnext',
        declaration: false,
      },
    }),
    terser(),
  ],
};
