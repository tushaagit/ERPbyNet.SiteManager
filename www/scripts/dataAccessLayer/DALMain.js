'use strict';

define(['jquery', 'cordova', 'localizer'],
       function ($, cordova, localizer) {

	var DALMain = {};

    DALMain.dbName = "SiteManager.sqlite";

    DALMain.db = null;

    DALMain.init = function(){
        if (window.navigator.simulator === true) {
            try{
                 // For debugin in simulator fallback to native SQL Lite
                //console.log("Use built in SQL Lite");
                DALMain.db = window.openDatabase(DALMain.dbName, "1.0", "SiteManager", 200000);
            }
            catch(err){
                alert(localizer.translateText("DALMain.databaseError") + " " + err.message);
            }

        }
        else {
            try {
        		DALMain.db = window.sqlitePlugin.openDatabase({name: DALMain.dbName, location: 0});
                //DALMain.db = window.openDatabase(DALMain.dbName, "1.0", "SmartSiteSurvey", 200000);
            }
            catch(err){
                alert(err.message);
            }
        }
    };

    /*DALMain.setupDatabase = function(){
        //Create all tables here
        DALAuthTokens.createTable();
    };*/

    //DALMain.initialize();

    return DALMain;
});
