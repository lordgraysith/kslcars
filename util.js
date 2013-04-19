exports.extractDataService = function () {
	return (process.argv[2] && process.argv[2].indexOf('db=') === 0 && process.argv[2].replace('db=', '')) || process.env.KSL_DATASERVICE || 'mongo';
}