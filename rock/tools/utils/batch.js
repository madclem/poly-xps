// batch.js

'use strict';

const fs = require('fs');
const checkExtension = require('./checkExtension');

function isDir(mPath) {
	return fs.lstatSync(mPath).isDirectory()
}

module.exports = function batch(mSourceDir, mDestDir, mTask, mExtensions, mCb) {
	//	DEFAULT EXTENSION
	mExtensions = mExtensions || [];

	fs.readdir(mSourceDir, (err, files) => {

		//	ERROR GETTING FOLDER
		if(err)
		{
			console.log('Error :', err);
			return;
		}

		let paths = files.filter((a)=> {
			return a.indexOf('DS_Store') === -1;
		});

		const folders = paths.filter((a)=> {
			return isDir(`${mSourceDir}/${a}`);
		});

		paths = paths.filter((a)=> {
			return !isDir(`${mSourceDir}/${a}`);
		});


		for(let i=0; i<folders.length; i++) {
			const a = folders[i];
			const sourceDir = `${mSourceDir}${a}/`;
			batch(sourceDir, mDestDir, mTask, mExtensions, mCb);
		}

		//	PROCESS FILES
		let count = 0;

		function checkCount() {
			count ++;
			if(count == paths.length && mCb) {
				mCb();
			}
		}

		paths.forEach( (mFile) => {
			//	CHECKING FOR EXTENSIONS
			if(checkExtension(mFile, mExtensions))
			{
				const filePath = mSourceDir + mFile;
				mTask(filePath, mDestDir, ()=> {
					checkCount();
				});
			} else {
				count ++;
				checkCount();
			}
		});
	});
}
