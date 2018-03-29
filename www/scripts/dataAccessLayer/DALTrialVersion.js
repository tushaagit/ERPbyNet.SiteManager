'use strict';
define(['jquery', 'cordova', 'app', 'DALMain'],
       function ($, cordova, app, DALMain) {

    var DALTrialVersion = {};
	DALTrialVersion.isTrialStillAvailable = function(limitDate, resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT AddedOn FROM ConfigParams ', [], function(tr, result){
                    if(result.rows.length == 0 || limitDate <= new Date(result.rows.item(0).AddedOn))
                        resultsCallback(true);
                   	else
                        resultsCallback(false);
                },  DALTrialVersion.onError)
        });
    };

    DALTrialVersion.onError = function(tr, err){
        alert( "DALTrialVersion error: " + err.message);
    };
    //app.DALTrialVersion = DALTrialVersion;
    return DALTrialVersion;
});
