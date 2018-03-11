const path = require('path');
const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./base');
const defaultSettings = require('./defaults');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ip = require('ip').address();


const config = Object.assign({}, baseConfig, {
  debug: true,

  entry: [
    'babel-polyfill',
    `webpack-dev-server/client?http://${ip}:${defaultSettings.port}`,
    'webpack/hot/dev-server',
    './src/js/index'
  ],
  cache: true,
  devtool: 'eval',//inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'dist/index.html'
    }),

    new OpenBrowserPlugin({ url: `http://${ip}:${defaultSettings.port}` })
  ],
  module: defaultSettings.getDefaultModules(),
  //  resolve: {
    //  fallback: path.join(__dirname, "node_modules"),
    //  'pixi.js': path.join(__dirname, 'node_modules/pixi.js')

  //  },
  resolveLoader: {
    root: path.join(__dirname, '../../node_modules'),
  },
  eslint: {
    failOnWarning: false,
    failOnError: false
  },


});

module.exports = config;
