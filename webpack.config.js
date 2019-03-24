const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebPackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const BUILD_DIR = path.resolve(__dirname, 'dist');
console.log(BUILD_DIR);
const APP_DIR = path.resolve(__dirname, 'src/client/app');
console.log(APP_DIR);

const config = {
  entry: {
    eventPage: `${APP_DIR}/eventPage.js`,
    app: `${APP_DIR}/app.jsx`,
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: ['babel-loader'],
    },
    {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [
        { loader: 'babel-loader' },
        {
          loader: 'react-svg-loader',
          options: {
            jsx: true,
          },
        },
      ],
    },
    {
      test: /\.styl$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader?sourceMap&modules&camelCase!stylus-loader',
    },
    {
      test: /\.png$/,
      loader: 'file-loader?name=assets/[name].[ext]',
    },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    inject: 'body',
    template: `${APP_DIR}/index.html`,
  }),
  new CopyWebPackPlugin([{ from: `${APP_DIR}/manifest.json` }]),
    // new BundleAnalyzerPlugin({
    //     analyzerPort: 8889,
    // }),
  ],
};

module.exports = config;
