// getFileName.js

const colors = require('./colors');
const path = require('path');

module.exports = function getFileName(mPath) {
	const ext = path.extname(mPath);
	const basename = path.basename(mPath, ext);
	return basename;
}