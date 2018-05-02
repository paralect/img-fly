const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname, './');

module.exports = {
  mode: 'development',

  entry: {
    main: [
      'babel-polyfill',
      'react-hot-loader/patch',
      './index.jsx',
    ],
  },

  output: {
    path: `${__dirname}/static/`,
    publicPath: '/static/',
    filename: '[name].js',
  },

  context,

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            [
              'react-css-modules',
              {
                context,
                exclude: 'node_modules',
                filetypes: {
                  '.pcss': {
                    syntax: 'postcss',
                    plugins: ['postcss-nested'],
                  },
                },
                generateScopedName: '[local]_[hash:base64:5]',
                webpackHotModuleReloading: true,
                handleMissingStyleName: 'ignore',
              },
            ],
          ],
        },
      },
      {
        test: /\.pcss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              camelCase: true,
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          { loader: 'file-loader' },
        ],
      },
    ],
  },

  devtool: 'eval',

  resolve: {
    modules: ['./', 'node_modules'],
    extensions: ['.js', '.jsx', '.pcss'],
  },

  plugins: [new webpack.NoEmitOnErrorsPlugin()],
};
