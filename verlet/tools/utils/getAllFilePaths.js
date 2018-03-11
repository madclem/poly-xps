// getAllFilePaths.js

'use strict';

const fs             = require('fs');
const isDir          = require('./isDirectory');
const checkExtension = require('./checkExtension');


function getAssetsInDir(mSourceDir, mCallback, mExtensions) {
	mExtensions = mExtensions || [];

	fs.readdir(mSourceDir, (err, files) => {

		const assetPath = mSourceDir.replace('./dist/', '');

		//	ERROR GETTING FOLDER
		if(err) {
			console.log('Error :', err);
			return;
		}

		let assets = files.filter((f)=> {
			return f.indexOf('DS_Store') === -1;
		});

		// console.log('Assets in ', mSourceDir, assets);

		for(let i=0; i<assets.length; i++) {
			let a = assets[i];
		}


		const folders = assets.filter((a)=> {
			return isDir(`${mSourceDir}/${a}`);
		});

		assets = assets.filter((a)=> {
			return !isDir(`${mSourceDir}/${a}`) && checkExtension(a, mExtensions);
		});

		assets = assets.map((f) => {
			return `${assetPath}${f}`;
		});

		if(folders.length == 0) {
			mCallback(assets);
		} else {
			let count = 0;
			const onAssets = (a) => {
				assets = assets.concat(a);
				count ++;
				if(count === folders.length) {
					mCallback(assets);
				}
			}

			for(let i=0; i<folders.length; i++) {
				let a = folders[i];
				getAssetsInDir(`${mSourceDir}${a}/`, onAssets);
			}
		}

	});
}

module.exports = getAssetsInDir;
