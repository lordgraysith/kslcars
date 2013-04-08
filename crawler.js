var crawler
, sentinel
, createSentinel
, jsdom = require("jsdom")
, fs = require("fs")
, carPageScript = fs.readFileSync("./carPage.js").toString()
, listPageScript = fs.readFileSync("./listPage.js").toString()
, createCrawler = function(eventManager){
    
    var jsdom = require("jsdom")
    , loadListPage
    , loadCarPage
    , carPageLoaded;

    carPageLoaded = function(errors, window){
        var carSaved
        , carDetails = window.DataMiner.getCarDetails();

        carSaved = function(){
            console.log('Saved car details: '+JSON.stringify(carDetails));
        };

        eventManager.once('data:carSaved', carSaved);
        eventManager.emit('data:saveCar', carDetails);
        eventManager.emit('sentinel:pageLoaded');
    };

    loadListPage = function(){

    };

    loadCarPage = function(url){
        jsdom.env({
            html: url
            , src: [carPageScript]
            , done: carPageLoaded
        });
    };

    eventManager.on('crawler:loadCarPage', loadCarPage);
    eventManager.on('crawler:loadListPage', loadListPage);

    return {};
};

createSentinel = function(eventManager){
    var listPages = []
    , carPages = []
    , addListPage
    , addCarPage
    , pageLoaded
    , carSaved;

    addCarPage = function(adID){

    };

    addListPage = function(adID){

    };

    eventManager.on('sentinel:addCarPage', addCarPage);
    eventManager.on('sentinel:addListPage', addListPage);
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
