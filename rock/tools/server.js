'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// TOOLS
const watcher = require('./watch');
const errorPrint = require('./error');

const config = require('./webpack.config');
const ip = require('ip').address();

/****************
 * SERVER
 ****************/
let isInitialCompilation = true;
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, config.devServer)
.listen(config.port, ip, (err) => {
  if (err) {
    errorPrint(err);
  }
  console.log(`Listening at ${ip}:${config.port}`);
});

compiler.plugin('done', () => {
  if (isInitialCompilation) {
    // Ensures that we log after webpack printed its stats (is there a better way?)
    setTimeout(() => {
      console.log('\n✓ The bundle is now ready for serving!\n');
      console.log('  Open in iframe mode:\t\x1b[33m%s\x1b[0m',  `http://${ip}:${config.port}/webpack-dev-server/`);
      console.log('  Open in inline mode:\t\x1b[33m%s\x1b[0m', `http://${ip}:${config.port}/\n`);
      console.log('  \x1b[33mHMR is active\x1b[0m. The bundle will automatically rebuild and live-update on changes.');
    }, 350);
  }
  isInitialCompilation = false;
});