var dataService
, createDataService = function(eventManager){
    
    var http = require('http')
	, saveCar
    , getAllAdIds
    , getAllCars
    , exit
    , connectionString = 'http://localhost:9092'
    , collection = 'carDetails';

    exit = function(event, error, data){
        eventManager.emit(event, error, data);
    };

    saveCar = function(carDetails){
		console.log('\n >>>>>ML SaveCar');
		
        var uri = '/cars/car-' + carDetails["adId"] + '.json';

        var options = {
                  hostname: 'localhost',
                  port: 9092,
                  path: '/v1/documents?uri='+uri+'&collection='+ collection + '&format=json',
                  method: 'PUT'
                };

		var req =  http.request(options, function(res) {
            
            console.log('\n >>>>>ML inSaveCar callback');    
            console.log('uri: '+ uri);     
            var body = "";
            res.on('data', function (chunk) {
                body = body + chunk;
                
            }); 
            res.on('end', function () {
                console.log('body: '+ body); 
                exit('data:carSaved', res.error, carDetails);
            });
            
        });

        req.write(JSON.stringify(carDetails));
        req.end();


    };

    getAllCars = function() {
        console.log('\n >>>>>ML getAllCars');        
        
        //sets config
        var config = 
        {
            "options": {
                "transform-results": {
                    "apply": "raw" 
                } 
            }
        }
	
		var options = {
                  hostname: 'localhost',
                  port: 9092,
                  path: '/v1/config/query/'+collection + '&format=json',
                  method: 'PUT'
                };

        var req =  http.request(options, function(res) {
            
            console.log('\n >>>>>ML SavingConfig callback');    
            console.log('config: '+ JSON.stringify(config));     
            var body = "";
            res.on('data', function (chunk) {
                body = body + chunk;
                
            }); 
            res.on('end', function () {
                console.log('body: '+ body); 
               
            });
            
        });
		req.write(JSON.stringify(config));
        req.end();
       

        //gets cars
		http.get(connectionString +'/v1/search?collection='+ collection +'&format=json&options='+collection+'&pageLength=4290000000', function(res) {
            var result = '';
            res.on('data', function (chunk) {
                result = result + chunk;
            });
            res.on('end', function () {
            	console.log('\n >>>>>ML gotAllCars');     
                exit('data:gotAllCars', null, result);
            });
        }).on('error', function(e) {
        	exit('data:gotAllCars', e, null);
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

            exit('data:gotAllAdIds', error, result);
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
