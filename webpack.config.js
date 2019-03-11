var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebPackPlugin = require('copy-webpack-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var BUILD_DIR = path.resolve(__dirname, 'dist')
console.log(BUILD_DIR)
var APP_DIR = path.resolve(__dirname, 'src/client/app')
console.log(APP_DIR)

var config = {
  entry: {
    app: APP_DIR + '/app.jsx',
    background: APP_DIR + '/eventPage.js'
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /eventPage.js$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      // {
      //   test: /\.html$/,
      //   exclude: /node_modules/,
      //   loader: 'html-loader?name=[name].[ext]'
      // },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?sourceMap&modules&camelCase!stylus-loader'
      },
      {
        test: /\.png$/,
        loader: 'file-loader?name=assets/[name].[ext]'
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin({
      inject: 'body',
      template: APP_DIR + '/index.html'
    }),
    new CopyWebPackPlugin([{ from: APP_DIR + '/manifest.json' }]),
    // new BundleAnalyzerPlugin({
    //     analyzerPort: 8889,
    // }),
  ]
}

module.exports = config