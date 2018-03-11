// replace-string.js

module.exports = function replaceString(str, pattern, strToReplace) {
	return str.replace(new RegExp(pattern, 'g'), strToReplace); 	
}