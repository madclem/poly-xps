const fs = require('fs-extra');
const colors = require('../utils/colors');

module.exports = function(source, dest, cb) {
	fs.copy(source, dest, function (err) {
		if (err) return console.error(err);
		console.log(`Copied to dist : ${source}`.green);
		if(cb)
		 cb();
	});
};
