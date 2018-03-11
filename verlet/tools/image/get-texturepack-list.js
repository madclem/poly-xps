// get-texturepack-list.js
const fs = require('fs');

module.exports = function getImageList(mPath, mCallback) {
	fs.readdir(mPath, (err, files) => {
		if(!files) {
			mCallback({
				full:[],
				mip:[],
				all:[]
			});
			return;
		}
		const jsons = files.filter((fileName)=> {
			return fileName.indexOf('.json') > -1;
		});

		const full = jsons.filter((fileName)=> {
			return fileName.indexOf('_mip') == -1;
		});

		const mip = jsons.filter((fileName)=> {
			return fileName.indexOf('_mip') > -1;
		});

		mCallback({
			full,
			mip,
			all:jsons
		});

	});
}