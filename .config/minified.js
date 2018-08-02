import { baseConfig } from './base';
import { addLicenseBanner } from './helpers/licenseBanner';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const minFilename = 'react-handsontable.min.js';

const minConfig = {
  output: {
    format: 'umd',
    name: 'Handsontable.react',
    indent: false,
    file: `./dist/${envHotType}/${minFilename}`
  },
  plugins: baseConfig.plugins.concat([
    uglify({
      output: {
        comments: /^!/
      },
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  ])
};

addLicenseBanner(minConfig);

export {minConfig};
