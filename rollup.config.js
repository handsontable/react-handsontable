import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-js';

const env = process.env.NODE_ENV;
const envHotType = process.env.HOT_TYPE;

const config = {
  input: 'src/common/index.jsx',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve(),
    replace({
      'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
    })
  ],
  external: [
    'react',
    'react-dom'
  ],
};

if (env === 'es' || env === 'cjs') {
  config.output = {
    format: env,
    indent: false,
    file: './' + (env === 'cjs' ? 'commonjs' : env) + '/' + envHotType + '/react-handsontable.js'
  };

  if (env === 'cjs') {
    config.plugins.push(commonjs());
  }

} else if (env === 'umd') {
  config.output = {
    format: 'umd',
    name: 'Handsontable.react',
    indent: false,
    file: './dist/' + envHotType + '/react-handsontable.js'
  };

} else if (env === 'min') {
  config.output = {
    format: 'umd',
    name: 'Handsontable.react',
    indent: false,
    file: './dist/' + envHotType + '/react-handsontable.min.js'
  };

  config.plugins.push(
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
  );
}

if (env === 'umd' || env === 'min') {
  const path = require('path');
  const fs = require('fs');
  const packageBody = require('./src/' + envHotType + '/package.json');

  let licenseBody = fs.readFileSync(path.resolve(__dirname, './LICENSE'), 'utf8');
  licenseBody += '\nVersion: ' + packageBody.version + ' (built at ' + new Date().toString() + ')';

  config.output.banner = '/*!\n' + licenseBody.replace(/^/gm, ' * ') + '\n */';
}

if (envHotType === 'ce') {
  config.external.push('handsontable');

} else if (envHotType === 'pro') {
  config.external.push('handsontable-pro');
}

export default config;
