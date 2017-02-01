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
      'handsontable': 'umd handsontable'
    },

    module: {
      loaders: [
        {
          test: /(\.js)|(\.jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        }
      ]
    },
  },
  {
    entry: {
      './demo/dist/react-handsontable-demo-bundle': './demo/demo-bundle'
    },

    output: {
      path: './',
      filename: '[name].js',
      library: 'ReactHandsontableDemo',
      libraryTarget: 'umd',
    },

    module: {
      loaders: [
        {
          test: /(\.js)|(\.jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        },
        {
          test: (/\.css$/), loader: "style-loader!css-loader"
        },
        {
          test: require.resolve('handsontable'),
          loader: 'expose?Handsontable'
        },
        {
          test: require.resolve('numbro'),
          loader: 'expose?numbro'
        },
        {
          test: require.resolve('moment'),
          loader: 'expose?moment'
        }, {
          test: require.resolve('pikaday'),
          loader: 'expose?Pikaday'
        }, {
          test: require.resolve('zeroclipboard'),
          loader: 'expose?ZeroClipboard'
        }
      ]
    }
  }
];
