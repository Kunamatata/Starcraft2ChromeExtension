var webpack = require('webpack')
var path = require('path')

var BUILD_DIR = path.resolve(__dirname, 'src/client/public')
var APP_DIR = path.resolve(__dirname, 'src/client/app')

var config = {
  entry: {
    javascript: APP_DIR + '/app.jsx',
    background: APP_DIR + '/eventPage.js',
    html: APP_DIR + '/index.html'
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      { 
        test: /eventPage.js$/, 
        loader: 'file?name=[name].[ext]' 
      },
      { 
        test: /manifest.json$/, 
        loader: 'file?name=[name].[ext]' 
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?sourceMap&modules&camelCase!stylus-loader'
      },
      { 
        test: /\.png$/, 
        loader: 'file?name=assets/[name].[ext]' 
      }
    ]
  }
}

module.exports = config