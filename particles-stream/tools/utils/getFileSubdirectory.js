const getFullFileName = require('./getFullFileName');

module.exports = function(basePath, path) {
	const fileName = getFullFileName(path);
	const abosultePath = basePath.replace('./', '');
	return path
	.replace(fileName,'')
	.replace(abosultePath, '')
	.replace('./', '');

};
