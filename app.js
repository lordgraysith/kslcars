var eventManager
, iter
, express = require('express')
, util = require('./util')
, app
, port = 5000;


//setup global variables
global.mongolabURI = process.env.MONGOLAB_URI || 'mongodb://localhost/kslcars';
global.kslStart = process.env.KSL_START || 'http://www.ksl.com/auto/search/index';
global.dataService = util.extractDataService();

eventManager = require('./eventManager').getEventManager();

// for(iter = 3548; iter > -1; iter--){
// 	eventManager.emit('sentinel:addListPage', global.kslStart + '?page=' + iter);
// }

//eventManager.emit('sentinel:addCarPage', 476005);
//eventManager.emit('sentinel:addListPage', global.kslStart);
eventManager.emit('sentinel:start');

app = express.createServer(express.logger());

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.favicon());
});

app.get('/stop', function(req, res){
	eventManager.emit('sentinel:stop');
	res.send('stopped');
});

app.get('/start', function(req, res){
	eventManager.emit('sentinel:start');
	res.send('started');
});

app.listen(port, function() {
  console.log('Listening on ' + port);
});