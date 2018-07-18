import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';

const envHotType = process.env.HOT_TYPE;

export const baseConfig = {
  input: 'src/common/index.tsx',
  plugins: [
    replace({
      'hot-alias': envHotType === 'pro' ? 'handsontable-pro' : 'handsontable',
    }),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve(),
  ],
  external: [
    'react',
    'react-dom',
    (envHotType === 'ce' ? 'handsontable' : 'handsontable-pro')
  ],
};

