// folderNameCheck.js

const isDirectory = require('./isDirectory');
const path = require('path');
const fs = require('fs');
const suffixes = ['{tps}', '{manifest}', '{fix}'];


function getFinalFolderName(str) {
	suffixes.forEach((suffix) => {
		str = str.replace(new RegExp(suffix), '');
	});

	return str;
}


const folderNameCheck = function(mPath, mCallback) {
	// console.log('Checking :', mPath);
	fs.readdir(mPath, (err, files)=> {
		let outputFolders = files.filter((p)=> {
			return isDirectory(path.resolve(mPath, p));
		});

		if(outputFolders.length == 0) {
			mCallback(false);
			return;
		}

		let orgFolderNames = outputFolders.concat();

		outputFolders = outputFolders.map((folderName)=> {
			return getFinalFolderName(folderName);
		});

		let hasDuplicated = false;
		outputFolders.forEach((folderName, i) => {
			let count = 0;
			outputFolders.forEach((fName) => {
				if(fName === folderName) {
					count ++;
				}
			});

			if(count > 1) {
				hasDuplicated = true;
				console.log('Duplicated Folder path :', path.resolve(mPath, orgFolderNames[i]));
			}
		});


		if(hasDuplicated) {
			mCallback(hasDuplicated);	
		} else {
			let cnt = 0;
			orgFolderNames.forEach((folderName)=> {
				folderNameCheck(path.resolve(mPath, folderName), (hasDupe) => {
					hasDuplicated = hasDuplicated || hasDupe;
					cnt ++;
					if(cnt === orgFolderNames.length) {
						mCallback(hasDuplicated);	
					}
				});
			});
		}
		
	});
}

module.exports = folderNameCheck;



