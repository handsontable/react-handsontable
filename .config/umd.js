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
    file: `./dist/${filename}`
  },
  plugins: baseConfig.plugins
};

addLicenseBanner(umdConfig);

export { umdConfig };
