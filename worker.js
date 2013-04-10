var eventManager
, iter;

//setup global variables
global.mongolabURI = process.env.MONGOLAB_URI || 'mongodb://localhost/kslcars';
global.kslStart = process.env.KSL_START || 'http://www.ksl.com/auto/search/index';

eventManager = require('./eventManager').getEventManager();

// for(iter = 3548; iter > -1; iter--){
// 	eventManager.emit('sentinel:addListPage', global.kslStart + '?page=' + iter);
// }

//eventManager.emit('sentinel:addCarPage', 476005);
eventManager.emit('sentinel:addListPage', global.kslStart);
eventManager.emit('sentinel:start');

