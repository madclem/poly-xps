// getFullFileName.js

'use strict';

module.exports = function getFileName(mPath) {
	const ary       = mPath.split('/');
	return ary[ary.length-1];
}