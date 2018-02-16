// path.js
'use strict';


const sourcePath = './assets/';
const absoluteSourcePath = 'assets/';
const destPath = './dist/assets/';


module.exports = {
	source:
	{
		absolute: absoluteSourcePath,
		path: sourcePath,
		audio: sourcePath + 'audio/',
		image: sourcePath + 'image/',
		json: sourcePath + 'json/',
		video: sourcePath + 'video/',
		model: sourcePath + 'model/',
		animate: sourcePath + 'animate/'
	},
	destination:
	{
		path: destPath,
		audio: destPath + 'audio/',
		image: destPath + 'image/',
		json: destPath + 'json/',
		video: destPath + 'video/',
		model: destPath + 'model/',
		animate: destPath + 'animate/'
	},
	manifest: './src/js/manifests/',
};
