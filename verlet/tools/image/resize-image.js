// resize-image.js

const im = require('imagemagick');
const colors = require('../utils/colors');

module.exports = function resizeImage(mPath, mDist, mWidth, mCb) {
	im.resize({
		srcPath: mPath,
		dstPath: mDist,
		width:   mWidth
	}, function(err, stdout, stderr){
		if (err) {
			// console.log(`Error resized ${mPath} to fit within ${mWidth}px`.red);
			// console.log(`Error : ${err}`.red);
			console.log(`Error : ${mPath} / ${mDist}`.red);
			throw err;
		}
		
		if(mCb) mCb();
	});
}