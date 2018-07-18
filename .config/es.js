import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'react-handsontable.js';

export const esConfig = {
  output: {
    format: env,
    indent: false,
    file: './es/' + envHotType + '/' + filename
  },
  plugins: [
    replace({
      'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      }
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve(),
  ],
};
