// get-folder-settings.js

const path = require('path');
const getOutputFolderName = require('./get-output-name');
const getRelativePath = require('./get-relative-path');

module.exports = function(mFolderPath, mRootPath) {

	const dirNames = mFolderPath.split(path.sep);
	const folderName = dirNames[dirNames.length-1];
	const outputFolderName = getOutputFolderName(folderName);
	const settings = {};

	if(folderName.indexOf('{tps}') > -1) {
		settings.tps = true;
	}

	if(folderName.indexOf('{manifest}') > -1) {
		settings.manifest = true;
	}

	settings.folderName = folderName;
	settings.outputFolderName = outputFolderName;
	settings.path = mFolderPath;
	settings.relativePath = getRelativePath(mFolderPath, mRootPath);

	return settings;
}
