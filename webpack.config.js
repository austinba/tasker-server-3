var ZipPlugin = require('zip-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');
var fs = require('fs');
var nodeModules = {};

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

console.log(__dirname);
module.exports = {
  name: 'server',
  entry: './src/index.js',
  target: 'node',
  // ignore: /node_modules/,
  output: {
    path: './dist',
    filename: 'server.js'
  },
  externals: nodeModules,
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new CopyWebpackPlugin([
      { from: 'package.json' },
      { from: 'app_config.json' },
      { from: '.ebextensions/**/*', to: '.ebextensions' }
    ]),
    new ZipPlugin({
      path: '../',
      filename: 'server.zip',
      pathPrefix: '',
      // include: [/\.js$/],
      // fileOptions: {
      //   mtime: new Date(),
      //   mode: 0o100664,
      //   compress: true,
      //   forceZip64Format: false,
      // },
      // zipOptions: {
      //   forceZip64Format: false,
      // },
    })
  ],
  module: {
    loaders:
      [ { test: /\.js$/, loader: 'babel-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
  }
};
