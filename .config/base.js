import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const envHotType = process.env.HOT_TYPE;

export const plugins = {
  replace: replace({
    'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable'
  }),
  typescript: typescript(),
  babel: babel({
    exclude: ['node_modules/**', '**.json'],
  }),
  nodeResolve: nodeResolve(),
  json: json({
    include: 'package.json',
    compact: true
  })
};

export const baseConfig = {
  input: 'src/common/index.tsx',
  plugins: [
    plugins.json,
    plugins.replace,
    plugins.typescript,
    plugins.babel,
    plugins.nodeResolve,
  ],
  external: [
    'react',
    'react-dom',
    (envHotType === 'ce' ? 'handsontable' : 'handsontable-pro')
  ],
};
