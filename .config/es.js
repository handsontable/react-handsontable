import typescript from 'rollup-plugin-typescript2';
import { plugins } from './base';

const env = process.env.NODE_ENV;
const filename = 'react-handsontable.js';

export const esConfig = {
  output: {
    format: env,
    indent: false,
    file: `./es/${filename}`
  },
  plugins: [
    plugins.json,
    plugins.replace,
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true
        }
      },
      useTsconfigDeclarationDir: true
    }),
    plugins.babel,
    plugins.nodeResolve,
  ],
};
