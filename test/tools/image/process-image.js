(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();
// image-test.js

const path = require('path');
const fs = require('fs-extra');
const Im = require('imagemagick');

const paths = require('../paths');
const folderNameCheck = require('../utils/folderNameCheck.js');
const isDirectory = require('../utils/isDirectory');
const checkExtension = require('../utils/checkExtension');
const cloneObject = require('../utils/clone-object');

const resizeimage = require('./resize-Image');
const getFolderSettings = require('./get-folder-settings');
const getOutputFolderName = require('./get-output-name');

const imgRootPath = path.resolve(paths.source.image);

const lowResScale = 0.5;

let MANIFESTS = {
	default:[]
}


const defaultSettings = {
	manifest:false,
	manifestFile:'default',
	tps:false
}

const getDirContent = function(mPath, mCallback) {
	fs.readdir(mPath, (err, files)=> {
		files = files.filter((fileName)=> {
			return fileName.indexOf('DS_Store') == -1;
		});

		const dir = files.filter((fileName)=> {
			const filePath = path.resolve(mPath, fileName);
			return isDirectory(filePath);
		});

		files = files.filter((fileName)=> {
			const filePath = path.resolve(mPath, fileName);
			return !isDirectory(filePath);
		});

		mCallback(err, {files, dir});
	});
}

const convertImage = function(mPath, mDestFolder, mFileName, mCallback) {
	const pathHigh = path.resolve(mDestFolder, mFileName);
	const pathLow = path.resolve(mDestFolder, mFileName.split('.').join('_mip.'));

	fs.ensureDir(mDestFolder, (folderPath)=> {
		console.log('here0', Im.readMetadata, mPath);
		Im.identify([mPath], (err, features)=> {
			if(err) {
				console.log('err,', err);
			} else {
				console.log('success', features);


				console.log('here2');
				let count = 0;


				const onDone = () => {
					count ++;

					if(count == 2 && mCallback) {
						mCallback();
					}
				}

				console.log('here', resizeimage);
				onDone();
				// resizeimage(mPath, pathHigh, features.width, onDone);
				// resizeImage(mPath, pathLow, features.width * lowResScale, onDone);
			
			}
		});
		// Im.identify(mPath, (err, features)=> {
			// if(err) {
			// 	console.log(err);
			// } else {
			// 	console.log('here2');
			// 	let count = 0;


			// 	const onDone = () => {
			// 		count ++;

			// 		if(count == 2 && mCallback) {
			// 			mCallback();
			// 		}
			// 	}

			// 	console.log('here');
			// 	resizeimage(mPath, pathHigh, features.width, onDone);
			// 	resizeImage(mPath, pathLow, features.width * lowResScale, onDone);
			// }
		// });
	});
}

const processFolder = function(mPath, mSettings, mCallback) {

	getDirContent(mPath, (err, sources) => {
		//	get folder settings
		const settings = getFolderSettings(mPath, imgRootPath);

		if(settings.manifest) {
			settings.manifestFile = settings.outputFolderName;
			MANIFESTS[settings.outputFolderName] = [];
		}

		if(settings.manifest === undefined) {
			settings.manifest = mSettings.manifest;
			settings.manifestFile = mSettings.manifestFile;
		}

		let outputPath = path.resolve(paths.destination.image);
		outputPath = path.resolve(outputPath, settings.relativePath);

		const { files, dir } = sources; 

		
		let finishCount = dir.length + files.length;

		const onDone = function() {
			finishCount--;
			if(finishCount == 0) {
				mCallback();
			}
		}

		dir.forEach((mFolderName) => {
			const subPath = path.resolve(mPath, mFolderName);
			processFolder(subPath, settings, onDone);
		});	

		files.forEach((fileName)=> {
			if(checkExtension(fileName, ['png', 'jpg', 'jpeg', 'gif'])) {
				const filePath = path.resolve(settings.path, fileName);
				const _outputPath = path.resolve(outputPath, fileName);
				// convertImage(filePath, outputPath, fileName, onDone);	
				console.log(filePath, outputPath, fileName)
				fs.copy(filePath, outputPath + '/' + fileName, onDone);

				MANIFESTS[settings.manifestFile].push('image/' + settings.relativePath + '/' + fileName);
			} else {
				onDone();
			}
			
		});
		
		
	});

}

module.exports = function(mCallback) {
	const _output = path.resolve(paths.destination.image);

	// console.log(`Output folder : ${_output}`.blue);

	fs.emptyDir(_output, (err)=> {
		folderNameCheck(imgRootPath, (mHasDupe)=> {

			if(!mHasDupe) {
				MANIFESTS = {
					default:[]
				}
				// return;
				const settings = cloneObject(defaultSettings);
				processFolder(imgRootPath, settings, ()=> {
					const json = JSON.stringify(MANIFESTS, null, 4);
					const outputJsonPath = path.resolve(paths.manifest, 'manifest.json');
					fs.writeFile(outputJsonPath, json, 'utf8', ()=> {
						console.log('Manifest json file created');

						if(mCallback) {
							mCallback();
						}
					});
				});
			} else {
				console.log('Has dupe Folder names !');
			}

		});	
	});
	
}
