// get-settings.js

'use strict';

module.exports = function getSettings(mPath) {
	const isFixedSize      = mPath.indexOf('{fix}') > -1;
	const separateManifest = mPath.indexOf('{manifest}') > -1;
	const texturePack      = mPath.indexOf('{tps}') > -1;
	const noTinypng          = mPath.indexOf('{no-tiny}') > -1;

	return {
		isFixedSize,
		separateManifest,
		texturePack,
		noTinypng
	}
}
