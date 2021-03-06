'use strict';

define(['jquery', 'cordova', 'DALMain', 'config'],
       function ($, cordova, DALMain, config) {

	var DALAuthTokens = {};

    DALAuthTokens.dropTable = function(){
        var db = DALMain.db;
        var dropTable = "DROP TABLE IF EXISTS AuthTokens";
        db.transaction(function(tx) {
            tx.executeSql(dropTable, [], function(){}, function(tr, err){alert(err.message);});
        });
    };

    DALAuthTokens.doesAuthTokensTableExists =  function(resultsCallback)
    {
        var db = DALMain.db;
        var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='AuthTokens'";
        db.transaction(function(tx){
            tx.executeSql(query, [], resultsCallback, function(tr, err){alert(err.message);});
        });
    };

    DALAuthTokens.createTable = function(callback){
        var db = DALMain.db;
        db.transaction(function(tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS AuthTokens(AuthToken TEXT PRIMARY KEY ASC, UserName TEXT, Password TEXT, AddedOn DATETIME, ExpiresOn DATETIME)",
                          [],
                          function(){
                			if (callback != null)
                                callback();
            			  },
                          function(tr, err){alert(err.message);
           	});
        });
    };

    DALAuthTokens.addAuthToken = function(authToken, userName, password, expiresOn, onSuccess, onError) {

        var db = DALMain.db;
        db.transaction(function(tx) {
            var addedOn = new Date();
            tx.executeSql("INSERT INTO AuthTokens(AuthToken, UserName, Password, AddedOn, ExpiresOn) VALUES (?, ?, ?, ?, ?)",
                          [authToken, userName, password, addedOn, expiresOn],
                          onSuccess,
                          onError);
        });
    }

    //This function returns the latest token if it has been received in last 2 days
    DALAuthTokens.getActiveToken = function(userName, password, onSuccess, onError) {
        var db = DALMain.db;
    	var tokenLife = config.tokenLife;
        db.transaction(function(tx) {
            var filterDate = new Date();
            tx.executeSql("SELECT * FROM  AuthTokens WHERE UserName = ? AND Password = ? AND ExpiresOn > ? ORDER BY AddedOn DESC",
                          [userName, password, filterDate],
                          onSuccess,
                          onError);
        });


    };
    //This function assumes user has logged-in and returns token for that user
    DALAuthTokens.getLoggedInUserToken = function(userName, onSuccess, onError) {
        var db = DALMain.db;
        db.transaction(function(tx) {
            var filterDate = new Date();
            tx.executeSql("SELECT * FROM  AuthTokens WHERE UserName = ? ORDER BY AddedOn DESC",
                          [userName],
                          onSuccess,
                          onError);
        });


    };

    //This function assumes user has logged-in and returns token for that user
    DALAuthTokens.removeLoggedInUserToken = function(userName, onSuccess, onError) {
        var db = DALMain.db;
        db.transaction(function(tx) {
            var filterDate = new Date();
            tx.executeSql("DELETE FROM  AuthTokens WHERE UserName = ?",
                          [userName],
                          onSuccess,
                          onError);
        });


    };
    //DALAuthTokens.createTable();

    return DALAuthTokens;
});
