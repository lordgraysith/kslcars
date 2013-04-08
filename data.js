var dataService
    , createDataService = function(eventManager){
    
    var MongoClient = require('mongodb').MongoClient
        , saveCar;

    saveCar = function(carDetails){
        var exit;

        exit = function(error, carDetails){
            eventManager.emit('data:carSaved', error, carDetails);
        };

        MongoClient.connect(global.mongolabURI, function(error, db) {
            if(error){
                exit(err, carDetails);
            }
            else
            {
                var collection = db.collection('carDetails');
                collection.save(carDetails, function() {
                    exit(error, carDetails);
                });
            }
        });
    };

    eventManager.on('data:saveCar', saveCar);

    return {};
};

exports.initDataService = function(eventManager){
    if(typeof dataService === 'undefined'){
        dataService = createDataService(eventManager);
    }
    return dataService;
};
