// image-watch.js
const watcher           = require('./watch');
const paths             = require('./paths');
const processImage 		= require('./image/process-image');
const path = require('path');



let timer;

const watcherAssets = watcher([
	'../assets/image/'
]);

watcherAssets.on('all',(event, file) => {
	if(file.indexOf('.DS_Store') > -1) return;
	if(event === 'unlink') {
		// remove files
		return;
	}
	// if(event !== 'change' && event !== 'add' && event !== 'addDir') return;
	
	clearTimeout(timer);
	timer = setTimeout(toProcessImage, 1000);
});


function toProcessImage() {
	console.log('to process image');
	processImage();
}