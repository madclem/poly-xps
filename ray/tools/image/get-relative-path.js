// get-relative-path.js

const path = require('path');
const getOutputFolderName = require('./get-output-name');

module.exports = function(mFolderPath, mRootPath) {
	const _path = path.relative(mRootPath, mFolderPath);
	const dirNames = _path.split(path.sep).map((folderName)=> {
		return getOutputFolderName(folderName);
	});

	const newPath = path.join(...dirNames);
	return newPath;
}