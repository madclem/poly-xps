// clone-object.js

module.exports = function(mSource) {
	const obj = {};
	Object.assign(obj, mSource);
	return obj;
}

