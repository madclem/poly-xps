const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./base');
const defaultSettings = require('./defaults');

const config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../../src/js/index'),
  cache: false,
  devtool: 'sourcemap',

  plugins: [
    new webpack.optimize.DedupePlugin(),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),

    new webpack.NoErrorsPlugin(),

  ],
  module: defaultSettings.getDefaultModules()

});

module.exports = config;
