var events = require('events')
	, util = require('util')
	, dataService = require('./'+global.dataService+'DataService')
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

//the data service must be initiated before the crawler
dataService.initDataService(eventManager);
crawler.initCrawler(eventManager);

exports.getEventManager = function(){
	return eventManager;
};