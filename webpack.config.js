var ZipPlugin = require('zip-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');
console.log(__dirname);
module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: './dist',
    filename: 'index.js'
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']), {
    //   root:
    // }),
    new CopyWebpackPlugin([
      { from: 'deploy_package.json', to: 'package.json' },
      { from: 'app_config.json' },
      { from: '.ebextensions/**/*', to: '.ebextensions' }
    ]),
    new ZipPlugin({
      path: '../',
      filename: 'my_app.zip',
      pathPrefix: '',
      // include: [/\.js$/],
      fileOptions: {
        mtime: new Date(),
        mode: 0o100664,
        compress: true,
        forceZip64Format: false,
      },
      zipOptions: {
        forceZip64Format: false,
      },
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      // exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
