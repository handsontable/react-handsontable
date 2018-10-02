import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { version as componentVersion } from './../package.json';

const envHotType = process.env.HOT_TYPE;

export const plugins = {
  replace: replace({
    'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
    'COMPONENT_VERSION': componentVersion
  }),
  typescript: typescript(),
  babel: babel({
    exclude: 'node_modules/**',
  }),
  nodeResolve: nodeResolve()
};

export const baseConfig = {
  input: 'src/common/index.tsx',
  plugins: [
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
