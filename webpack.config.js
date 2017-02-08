module.exports = [
  {
    devtool: 'source-map',
    entry: {
      './dist/react-handsontable': './src/index',
    },

    output: {
      path: './',
      filename: '[name].js',
      library: 'HotTable',
      libraryTarget: 'umd',
    },

    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
        umd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
        umd: 'react'
      },
      'handsontable': {
        root: 'Handsontable',
        commonjs2: 'handsontable',
        commonjs: 'handsontable',
        amd: 'handsontable',
        umd: 'handsontable'
      }
    },

    module: {
      loaders: [
        {
          test: /(\.js)|(\.jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    },
  }
];
