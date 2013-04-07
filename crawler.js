var crawler
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

exports.initCrawler = function(eventManager){
    if(typeof crawler === 'undefined'){
        crawler = createCrawler(eventManager);
    }
    return crawler;
};
