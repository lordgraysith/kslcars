var crawler
, sentinel
, createSentinel
, createCrawler = function(eventManager){
    
    var jsdom = require("jsdom")
    , loadListPage
    , loadCarPage;

    loadListPage = function(){

    };

    loadCarPage = function(){

    };

    eventManager.on('crawler:loadCarPage', loadCarPage);
    eventManager.on('crawler:loadListPage', loadListPage);

    return {};
};

createSentinel = function(eventManager){
    var listPages
    , carPages
    , addListPage
    , addCarPage
    , pageLoaded;
};

exports.initCrawler = function(eventManager){
    if(typeof crawler === 'undefined'){
        crawler = createCrawler(eventManager);
    }
    if(typeof sentinel === 'undefined'){
        sentinel = createSentinel(eventManager);
    }
    return {};
};
