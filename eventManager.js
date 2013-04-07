var events = require('events')
	, util = require('util')
	, dataService = require('./data')
	, createEventManager
	, eventManager
	, init
	, crawler = require('./crawler');

eventManager = (function(){
	var EventManager = function(){
		var self = this;
		events.EventEmitter.call(self);

		self.init = function(){
			
		};

		self.init();
	};
	util.inherits(EventManager, events.EventEmitter);

	return new EventManager();
}());

crawler.initCrawler(eventManager);
dataService.initDataService(eventManager);

exports.getEventManager = function(){
	return eventManager;
};