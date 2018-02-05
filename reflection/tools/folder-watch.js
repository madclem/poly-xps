const dir 							= require('node-dir');
const fs = require('fs-extra');
const copy = require('./utils/copy');
const paths = require('./paths');
const watcher = require('./watch');
const getFullFileName = require('./utils/getFullFileName');
const getFileSubdirectory = require('./utils/getFileSubdirectory');
const checkExtension 		= require('./utils/checkExtension');
const optimize 		= require('./obj/optimize');
const generateObjList = require('./obj/generate-obj-list');
const getAllFilePaths   = require('./utils/getAllFilePaths');

const watcherAssets = watcher([
	paths.source.path
]);

watcherAssets.on('all',(event, file) => {
	const dir = getFileSubdirectory(paths.source.path,file);
	const fileName = getFullFileName(file);
	const ouputPath = `${paths.destination.path}${dir}${fileName}`;

	if(event === 'unlink') {
		fs.removeSync(ouputPath);
		return;
	}
	if(event !== 'change' && event !== 'add') return;
	if(file.indexOf('.DS_Store') > -1 || file.search(/image|audio|json|model/) > -1) return;

	copy(file,ouputPath);

});
