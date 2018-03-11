// isDirectory.js

'use strict';

const fs = require('fs');

module.exports = function isDirectory(mPath) {
	return fs.lstatSync(mPath).isDirectory();
}