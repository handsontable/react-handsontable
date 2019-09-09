import { addLicenseBanner } from './helpers/licenseBanner';
import { baseConfig } from "./base";

const env = process.env.NODE_ENV;
const filename = 'react-handsontable.js';

const umdConfig = {
  output: {
    format: env,
    name: 'Handsontable.react',
    indent: false,
    sourcemap: true,
    exports: 'named',
    file: `./dist/${filename}`,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      handsontable: 'Handsontable'
    }
  },
  plugins: baseConfig.plugins
};

addLicenseBanner(umdConfig);

export { umdConfig };
