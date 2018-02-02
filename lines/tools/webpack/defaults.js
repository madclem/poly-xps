/* Function that returns all default values */
const path = require('path');
const srcPath = path.join(__dirname, '/../../src');
const dfltPort = 8080;


/**
 * Get the default modules object for webpack
 * @return {Object}
 */

 function getDefaultModules() {
   return {
     loaders: [
       {
         test: /\.css$/,
         loader: 'style-loader!css-loader'
      },
      {
        test: /\.scss/,
        loaders: ["style-loader", "css-loader", "sass-loader?outputStyle=expanded"]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw',
        exclude: /node_modules/
      },
      {
        test: /node_modules/,
        loader: 'ify'
      },
      {
       test: /\.js$/,
       loader: 'babel',
       exclude: /node_modules/,
       query: {
         cacheDirectory: true,
         presets: [['es2015', {loose: true}]],
         plugins: [
          'add-module-exports'
         ]
       }
      }
     ]
   };
 }

 module.exports = {
   srcPath: srcPath,
   port: dfltPort,
   publicPath: '/dist/',
   getDefaultModules: getDefaultModules
 };
