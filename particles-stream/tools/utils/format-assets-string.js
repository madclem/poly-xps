// format-assets-string.js

'use strict';

module.exports = function formatAssetsString(mFiles) {
	let strList = Array.isArray(mFiles) ? JSON.stringify(mFiles) : mFiles;
	strList = strList.replace('[', '[\n\t');
	strList = strList.replace(']', '\n]');
	strList = strList.split('","').join('",\n\t"');	

	return strList;
}