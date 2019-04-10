import { baseConfig } from './base';
import { addLicenseBanner } from './helpers/licenseBanner';
import { uglify } from 'rollup-plugin-uglify';

const minFilename = 'react-handsontable.min.js';

const minConfig = {
  output: {
    format: 'umd',
    name: 'Handsontable.react',
    indent: false,
    sourcemap: true,
    file: `./dist/${minFilename}`
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

export { minConfig };
