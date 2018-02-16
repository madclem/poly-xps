// const watcher = require('./watch');
// const { createServer, reload } = require('./browser');
// const server = createServer();
// const fs = require('fs-extra')
// const mkdirp = require('mkdirp');
// const browserify = require('browserify');
// const babelify = require('babelify');
// const stringify = require('stringify');
// const notifier = require('node-notifier'); // the pop up in the top right corner
// const errorPrint = require('./error');
//
//
// // watch everything
// const watcherAssets = watcher([
//     './src/*.html',
//     './src/assets/**/*',
// ]);
//
// watcherAssets.on('all',(event, file) => {
//     if(event !== 'change' && event !== 'add') return;
//
//     reload();
// })
//
// // watch JS files specifically
// const watcherScript = watcher([
//     './src/**/*.js'
// ]);
//
// watcherScript.on('all',(event, file) => {
//     if(event !== 'change' && event !== 'add') return;
//
//     const b = browserify("./src/index.js")
//         .transform("babelify", {presets: ["es2015"]})
//         .transform("stringify")
//         .bundle()
//         .pipe(fs.createWriteStream(".tmp/scripts/main.js"))
//
//     b.on('finish', function() {
//         reload();
//     });
// });
