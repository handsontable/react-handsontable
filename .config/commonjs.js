import typescript from 'rollup-plugin-typescript2';
import { baseConfig, plugins } from './base';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const filename = 'react-handsontable.js';

export const cjsConfig = {
  output: {
    format: env,
    indent: false,
    file: `./commonjs/${filename}`
  },
  plugins: [
    plugins.json,
    plugins.replace,
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      }
    }),
    plugins.babel,
    plugins.nodeResolve,
    commonjs()
  ],
  // plugins: baseConfig.plugins.concat([
  //   commonjs(),
  // ])
};
