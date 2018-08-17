import { addLicenseBanner } from './helpers/licenseBanner';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;
const filename = 'react-handsontable.js';

const umdConfig = {
  output: {
    format: env,
    name: 'Handsontable.react',
    indent: false,
    sourcemap: true,
    file: `./dist/${envHotType}/${filename}`
  }
};

addLicenseBanner(umdConfig);

export { umdConfig };
