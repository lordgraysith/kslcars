var eventManager = require('./eventManager').getEventManager();

//setup global variables
global.mongolabURI = process.env.MONGOLAB_URI || 'mongodb://localhost/kslcars';
global.kslStart = process.env.KSL_START || 'http://www.ksl.com/auto/search';
