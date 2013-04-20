exports.extractDataService = function () {
	return (process.argv[2] && process.argv[2].indexOf('db=') === 0 && process.argv[2].replace('db=', '')) || process.env.KSL_DATASERVICE || 'mongo';
}

exports.extractRunBackLog = function () {
	return (process.argv[3] && process.argv[3].indexOf('backLog=') === 0 && process.argv[3].replace('backLog=', '')) || process.env.KSL_backLog || false;
}
