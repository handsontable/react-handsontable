import { baseConfig } from './base';
import commonjs from 'rollup-plugin-commonjs';

const env = process.env.NODE_ENV;
const filename = 'react-handsontable.js';

export const cjsConfig = {
  output: {
    format: env,
    indent: false,
    file: `./commonjs/${filename}`
  },
  plugins: baseConfig.plugins.concat([commonjs()])
};
