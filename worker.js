var eventManager = require('./eventManager').getEventManager();

//setup global variables
global.mongolabURI = process.env.MONGOLAB_URI || 'mongodb://localhost/kslcars';
global.kslStart = process.env.KSL_START || 'http://www.ksl.com/auto/search/index';

eventManager.emit('sentinel:addListPage', global.kslStart);
//eventManager.emit('sentinel:addCarPage', 476005);
eventManager.emit('sentinel:start');
