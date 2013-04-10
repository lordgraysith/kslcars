var crawler
, sentinel
, createSentinel
, jsdom = require('jsdom')
, fs = require('fs')
, http = require('http')
, savedCarAds = []
, carPageScript = fs.readFileSync('./carPage.js').toString()
, listPageScript = fs.readFileSync('./listPage.js').toString()
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
        return url.match(/\/auto\/listing\/([\d-]*)(.*)/i)[1];
    };

    makeCarUrl = function(adID){
        return "http://www.ksl.com/auto/listing/" + adID;
    };

    carSaved = function(error, carDetails){
        savedCarAds.push(carDetails.adID.toString());
    };

    carPageLoaded = function(errors, window){
        //console.log('carPageLoaded');
        var carDetails;

        if(!window.DataMiner){
            console.log('failed to parse '+window.location.href);
            eventManager.emit('sentinel:pageLoaded');
            return;
        }

        carDetails = window.DataMiner.getCarDetails();

        eventManager.emit('data:saveCar', carDetails);
        eventManager.emit('sentinel:pageLoaded');
    };

    listPageLoaded = function(carPages){
        var iter;
        for(iter = 0; iter < carPages.length; iter++){
            eventManager.emit('sentinel:addCarPage', parseAdID(carPages[iter]));
            //console.log(parseAdID(carPages[iter]));
        }
        eventManager.emit('sentinel:pageLoaded');
    };

    loadListPage = function(url){
        console.log('loading '+url);
        http.get("http://www.ksl.com/auto/search/index", function(res) {
            var data = '';
            res.on('data', function (chunk) {
                data = data + chunk;
            });
            res.on('end', function () {
                listPageLoaded(data.match(/<div class="srp-listing-title">(.*)href="(.*)"(.*)<\/div>/gim));
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    };

    loadCarPage = function(adID){
        if(savedCarAds.indexOf(adID) > -1){
            eventManager.emit('sentinel:pageLoaded');
            return;
        }
        var url = makeCarUrl(adID);
        console.log('loading '+url);
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
    , gotAllAdIDs
    , initiating
    , loadNext;

    addCarPage = function(adID){
        //console.log(adID+ ' added');
        carPages.push(adID);
        added();
    };

    addListPage = function(url){
        //console.log(url+ ' added');
        listPages.push(url);
        added();
    };

    added = function(){
        //console.log('state is '+state);
        if(state === 'waiting'){
            loadNext();
        }
    };

    start = function(){
        //console.log('sentinel started');
        state = 'waiting';
        if(!initiating){
            loadNext();
        }
    };

    pageLoaded = function(){
        //console.log('pageLoaded');
        if(state !== 'off'){
            loadNext();
        }
    };

    loadNext = function(){
        //console.log('loadNext');
        var next;
        state = 'running';

        next = carPages.pop();
        if(typeof next !== 'undefined'){
            eventManager.emit('crawler:loadCarPage', next);
            return;
        }
        
        next = listPages.pop();
        if(typeof next !== 'undefined'){
            eventManager.emit('crawler:loadListPage', next);
            return;
        }

        state = 'waiting';
        setTimeout(function() {
            addListPage(global.kslStart);
        }, 15000);
    };

    stop = function(){
        state = 'off';
    };

    gotAllAdIDs = function(error, adIds){
        savedCarAds = adIds;
        initiating = false;
        if(state === 'waiting'){
            start();
        }
    };

    eventManager.on('sentinel:addCarPage', addCarPage);
    eventManager.on('sentinel:addListPage', addListPage);
    eventManager.on('sentinel:start', start);
    eventManager.on('sentinel:stop', stop);
    eventManager.on('sentinel:pageLoaded', pageLoaded);
    eventManager.once('data:gotAllAdIDs', gotAllAdIDs);

    initiating = true;
    eventManager.emit('data:getAllAdIDs');
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
