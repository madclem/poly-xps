// get-output-name.js

const suffixes = ['{tps}', '{manifest}', '{fix}', '{no-tiny}'];

module.exports = function(str) {
	suffixes.forEach((suffix) => {
		str = str.replace(new RegExp(suffix), '');
	});

	return str;
}
