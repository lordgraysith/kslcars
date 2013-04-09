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
    , carSaved
    , carPageLoaded
    , listPageLoaded
    , parseAdID
    , makeCarUrl;

    parseAdID = function(url){
        return url.match(/www\.ksl\.com\/auto\/listing\/([\d-]*)(.*)/i)[1];
    };

    makeCarUrl = function(adID){
        return "http://www.ksl.com/auto/listing/" + adID;
    };

    carSaved = function(carDetails){
        console.log('Saved car details: '+JSON.stringify(carDetails));
    };

    carPageLoaded = function(errors, window){
        var carDetails = window.DataMiner.getCarDetails();

        eventManager.emit('data:saveCar', carDetails);
        eventManager.emit('sentinel:pageLoaded');
    };

    listPageLoaded = function(errors, window){
        var iter
        , carPages = window.DataMiner.getPages().carPages;
        for(iter = 0; iter < carPages.length; iter++){
            eventManager.emit('sentinel:addCarPage', parseAdID(carPages[iter]));
        }
    };

    loadListPage = function(url){
        jsdom.env({
            html: url
            , src: [listPageScript]
            , done: listPageLoaded
        });
    };

    loadCarPage = function(adID){
        var url = makeCarUrl(adID);
        jsdom.env({
            html: url
            , src: [carPageScript]
            , done: carPageLoaded
        });
    };

    eventManager.on('data:carSaved', carSaved);
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
    , carSaved
    , state = 'off'
    , added
    , start
    , stop
    , loadNext;

    addCarPage = function(adID){
        carPages.push(adID);
        eventManager.emit('sentinel:added');
    };

    addListPage = function(url){
        listPages.push(url);
        eventManager.emit('sentinel:added');
    };

    added = function(){
        if(state === 'waiting'){
            eventManager.emit('sentinel:loadNext');
        }
    };

    start = function(){
        state = 'waiting';
        eventManager.emit('sentinel:loadNext');
    };

    pageLoaded = function(){
        if(state !== 'off'){
            eventManager.emit('sentinel:loadNext');
        }
    };

    loadNext = function(){
        var next;
        state = 'running';
        next = listPages.pop();
        if(typeof next !== 'undefined'){
            eventManager.emit('crawler:loadListPage', next);
            return;
        }

        next = carPages.pop();
        if(typeof next !== 'undefined'){
            eventManager.emit('crawler:loadCarPage', next);
            return;
        }

        state = 'waiting';
    };

    stop = function(){
        listPages = [];
        carPages = [];
        state = off;
    };

    eventManager.on('sentinel:addCarPage', addCarPage);
    eventManager.on('sentinel:addListPage', addListPage);
    eventManager.on('sentinel:added', added);
    eventManager.on('sentinel:start', start);
    eventManager.on('sentinel:loadNext', loadNext);
    eventManager.on('sentinel:stop', stop);
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
