var dataService
, createDataService = function(eventManager){
    
    var mongoClient = require('mongodb').MongoClient
    , saveCar
    , getAllAdIds
    , getAllCars
    , exit;

    exit = function(event, error, data, db){
        if(db){
            db.close();
        }
        eventManager.emit(event, error, data);
    };

    saveCar = function(carDetails){
        mongoClient.connect(global.mongolabURI, function(error, db) {
            if(error){
                exit('data:carSaved', error, carDetails, db);
            }
            else
            {
                var collection = db.collection('carDetails');
                collection.save(carDetails, function() {
                    exit('data:carSaved', error, carDetails, db);
                });
            }
        });
    };

    getAllCars = function() {
        mongoClient.connect(global.mongolabURI, function(error, db) {
            if(error){
                exit('data:gotAllCars', error, null, db);
            }
            else
            {
                var collection = db.collection('carDetails');
                collection.find().toArray(function(error, items) {
                    exit('data:gotAllCars', error, items, db);
                });
            }
        });
    };

    getAllAdIds = function(){
        var gotAllCars;

        gotAllCars = function(error, carDetails){
            var result = []
            , iter;

            for(iter = 0; iter < carDetails.length; iter++){
                result.push(carDetails[iter]["adId"]);
            }

            exit('data:gotAllAdIds', error, result, null);
        };

        eventManager.once('data:gotAllCars', gotAllCars);
        getAllCars();
    };

    eventManager.on('data:saveCar', saveCar);
    eventManager.on('data:getAllAdIds', getAllAdIds);
    eventManager.on('data:getAllCars', getAllCars);

    return {};
};

exports.initDataService = function(eventManager){
    if(typeof dataService === 'undefined'){
        dataService = createDataService(eventManager);
    }
    return dataService;
};
