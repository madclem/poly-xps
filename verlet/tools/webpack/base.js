const path = require('path');
const defaultSettings = require('./defaults');

module.exports = {
  port: defaultSettings.port,
  debug: true,
  output: {
    path: path.join(__dirname, '../../dist/'),
    filename: 'main.js',
    publicPath: defaultSettings.publicPath
  },
  devServer: {
    contentBase: 'dist',
    // inline:true,
    hot: true,

    // noInfo: false,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
  },
  watch: true,
  resolve: {
    alias: {
        'poly'      : path.join(__dirname, '../../node_modules/poly.js/src'),
        'utils'      : path.join(__dirname, '../../src/js/utils'),
    }
  }
}
