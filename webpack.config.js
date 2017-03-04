var ZipPlugin = require('zip-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');
var fs = require('fs');
var nodeModules = {};

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => { nodeModules[mod] = `commonjs ${mod}`; });

const currentVersion = fs.readFileSync('.version').toString();
let nextVersion = currentVersion.split('.');
nextVersion[1] = (parseInt(nextVersion[1])+100001).toString().substr(1);
nextVersion = nextVersion.join('.');
fs.writeFileSync('.version', nextVersion);

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
      { from: '.ebextensions/**/*' }
    ]),
    new ZipPlugin({
      path: './',
      filename: currentVersion + '.zip',
      pathPrefix: ''
    })
  ],
  module: {
    loaders:
      [ { test: /\.js$/, loader: 'babel-loader' },
        { test: /\.json$/, loader: 'json-loader' }
      ]
  }
};
