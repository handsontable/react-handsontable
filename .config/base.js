import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

export const plugins = {
  typescript: typescript(),
  babel: babel({
    babelrc: false,
    exclude: ['node_modules/**', '**.json'],
    extensions: ['.js', '.ts', '.tsx', '.jsx'],
    presets: [
      '@babel/env'
    ],
  }),
  nodeResolve: nodeResolve(),
  json: json({
    include: 'package.json',
    compact: true
  })
};

export const baseConfig = {
  input: 'src/index.tsx',
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
    'handsontable'
  ],
};
