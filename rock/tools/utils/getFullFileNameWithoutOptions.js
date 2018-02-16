// getFullFileName.js

'use strict';

module.exports = function getFullFilenameWithoutOptions(mPath) {
	const ary       = mPath.split('/');
	let filename = ary[ary.length-1];
	filename = filename.replace(/{.*}/g, '');
	return filename;
}
