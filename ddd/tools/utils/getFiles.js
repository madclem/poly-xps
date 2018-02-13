// getFiles.js

'use strict';

const fs = require('fs');
const checkExtension = require('./checkExtension');

module.exports = function(mPaths, mExtensions, mCb) {

	let count = mPaths.length;
	let allFiles = [];

	mPaths.forEach((mPath)=> {

		fs.readdir(mPath, (err, files) => {

			files = files.filter((f)=> {
				return f.indexOf('DS_Store') == -1 && checkExtension(f, mExtensions);
			});

			files = files.map((f)=> {
				return mPath + '/' + f;
			});

			allFiles = allFiles.concat(files);
			count --;
			if(count == 0) {
				if(mCb) {
					mCb(allFiles);
				}
			}
		});	
	});

}