const paths = require('./paths');
const dir = require('node-dir');
const copy = require('./utils/copy');

dir.subdirs(paths.source.path, function(err, subdirs) {
	if (err) throw err;
	subdirs = subdirs.filter(function (directory) {
		return directory.search(/image|audio|json|model/) === -1;
	});


	for (var i = 0; i < subdirs.length; i++) {
		const folderName = subdirs[i].replace(paths.source.absolute,'');
		copy(subdirs[i], `${paths.destination.path}${folderName}`);

	}
});
