var express = require('express')
, eventManager = require('./eventManager').getEventManager()
, router = require('./routes').getRouter(eventManager)
, app
, port = process.env.PORT || 5000;

app = express.createServer(express.logger());

app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: process.env.SECRET || 'totally secure' }));
});

app.get('/', router.root);

app.listen(port, function() {
  console.log('Listening on ' + port);
});

//setup global variables
global.mongolabURI = process.env.MONGOLAB_URI || 'mongodb://localhost/kslcars';