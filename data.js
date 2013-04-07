var dataService
    , createDataService = function(eventManager){
    
    var self = this
        , MongoClient = require('mongodb').MongoClient
        , init
        , getAllUsers
        , getUser
        , getUserByUsername
        , saveUser
        , saveToken;

    getAllUsers = function() {
        console.log('data.getAllUsers');
        MongoClient.connect(global.mongolabURI, function(err, db) {
            if(err) throw err;
            var collection = db.collection('users');
            collection.find().toArray(function(err, items) {
                eventManager.emit('data:gotAllUsers', items);
            });
        });
    };

    getUserByUsername = function(username){
        MongoClient.connect(global.mongolabURI, function(err, db) {
            if(err) throw err;
            var collection = db.collection('users');
            collection.find({username: username}).toArray(function(err, items) {
                var user
                    , userdata;
                if(items.length === 1){
                    userdata = items[0];
                    user = {
                        username: userdata.username
                        , email: userdata.email
                    };
                }
                else{
                    user = null;
                }
                    
                eventManager.emit('data:gotUserByUsername', user);
            });
        });
    };

    getUser = function(username, password){
        MongoClient.connect(global.mongolabURI, function(err, db) {
            if(err) throw err;
            var collection = db.collection('users');
            collection.find({username: username, password: password}).toArray(function(err, items) {
                var user
                    , userdata;
                if(items.length === 1){
                    userdata = items[0];
                    user = {
                        username: userdata.username
                        , email: userdata.email
                    };
                }
                else{
                    user = null;
                }
                    
                eventManager.emit('data:gotUser', user);
            });
        });
    };

    saveUser = function(user){
        MongoClient.connect(global.mongolabURI, function(err, db) {
            if(err) throw err;
            var collection = db.collection('users');
            collection.save(user, function() {
                eventManager.emit('data:userSaved', user);
            });
        });
    }

    saveToken = function(user, token){
        var save
        , exit
        , checkUnusedExistingToken;

        exit = function(error){
            eventManager.emit('data:tokenSaved', error);
        };

        save = function(){
            MongoClient.connect(global.mongolabURI, function(err, db) {
                if(err) {
                    exit(err);
                    return;
                }

                try{
                    var collection
                    , tokenRecord;

                    tokenRecord = {
                        user:user.username
                        , token: token
                        , used: false
                        , usedBy: null
                    };

                    collection = db.collection('tokens');
                    collection.save(tokenRecord, function() {
                        exit(null);
                    });
                }
                catch(exception){
                    exit(exception);
                }
            });
        };

        checkUnusedExistingToken = function(){
            var gotToken = function(tokenData){
                if(tokenData){
                    console.log('Tried to create a duplicate token');
                    exit({message: 'Token Exists'});
                }
                else{
                    save();
                }
            };
            
            eventManager.once('data:gotToken', gotToken);
            getToken(token, false);
        };

        checkUnusedExistingToken();
    };

    getToken = function(token, used){
        MongoClient.connect(global.mongolabURI, function(err, db) {
            if(err) throw err;
            var collection = db.collection('tokens');
            collection.find({token:token, used:used}).toArray(function(err, items) {
                var tokenData;
                if(items.length > 0){
                    tokenData = items[0];
                }
                else{
                    tokenData = null;
                }
                    
                eventManager.emit('data:gotToken', tokenData);
            });
        });
    };

    eventManager.on('data:getAllUsers', getAllUsers);
    eventManager.on('data:getUser', getUser);
    eventManager.on('data:saveUser', saveUser);
    eventManager.on('data:getUserByUsername', getUserByUsername);
    eventManager.on('data:saveToken', saveToken);

    return {};
};

exports.initDataService = function(eventManager){
    if(typeof dataService === 'undefined'){
        dataService = createDataService(eventManager);
    }
    return dataService;
};
