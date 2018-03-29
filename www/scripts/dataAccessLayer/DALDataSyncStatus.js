'use strict';
define(['jquery', 'cordova', 'app', 'localizer', 'DALMain','WSHandler'],
       function ($, cordova, app, localizer, DALMain, WSHandler) {

    	var DALDataSyncStatus = {};

        DALDataSyncStatus.dropTable = function(){
            var db = DALMain.db;
            var dropTable = "DROP TABLE IF EXISTS DataSyncStatus";
            db.transaction(function(tx) {
                tx.executeSql(dropTable, []);
            });
        };

    	DALDataSyncStatus.createTable = function(callback)
        {
            var db=DALMain.db;
            var tblDefinition = "CREATE TABLE IF NOT EXISTS DataSyncStatus ("
                                + " DataCategoryID INTEGER, "
                                + " DataCategoryName TEXT , "
                                + "AddedOn TEXTDATETIME, "
                                + "UpdatedOn TEXTDATETIME,"
                                + "RowGUID TEXT, "
                                + "IsActive INTEGER DEFAULT 1, "
                                + "IsDeleted INTEGER DEFAULT 0, "
                                + " PRIMARY KEY(DataCategoryID) "
                                + " );";
            db.transaction(function(tx){
                tx.executeSql(tblDefinition, [], function(){
                    if(callback != null)
                        callback();
                },
                DALDataSyncStatus.onError);
            });
        };

	    DALDataSyncStatus.clearData=function(callback)
        {
          	var db=DALMain.db;
            var dropTable = "DELETE FROM  DataSyncStatus";
            db.transaction(function (tx){
                tx.executeSql(dropTable,[], function(){
                    if(callback != null)
                        callback();
                });
            });
        };

        DALDataSyncStatus.addDataSyncStatus = function(dataCategoryID, dataCategoryName, callback)
        {
            var db = DALMain.db;
            var addedOn = new Date();
        	var rowGUID = app.getGUID();
            var addQuery = "INSERT INTO DataSyncStatus(DataCategoryID, DataCategoryName, AddedOn, RowGUID) VALUES(?, ?, ?, ?)";
            db.transaction(function(tx)
            {
                tx.executeSql(addQuery, [dataCategoryID, dataCategoryName, addedOn, rowGUID], function(){
                    if(callback != null)
                        callback();
                }, DALDataSyncStatus.onError);
            });
        };

    	DALDataSyncStatus.isLocalDatabaseUpdated = function(dataCategoryID, serverUpdatedTime, resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT UpdatedOn FROM DataSyncStatus WHERE DataCategoryID = ? AND (ifnull(length(UpdatedOn), 0) = 0 OR UpdatedOn < ?)', [dataCategoryID, serverUpdatedTime], resultsCallback,  DALDataSyncStatus.onError)
        	});
    	};

        DALDataSyncStatus.getDataSyncStatusList = function(resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT DataCategoryID, UpdatedOn FROM DataSyncStatus ORDER BY DataCategoryID', [], resultsCallback,  DALDataSyncStatus.onError)
        	});
    	};

    	DALDataSyncStatus.getDataSyncStatus = function(resultsCallback){
        var db = DALMain.db;
        db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM DataSyncStatus', [], resultsCallback,  DALDataSyncStatus.onError)
        	});
    	};

    DALDataSyncStatus.setUpdatedOn = function(serverUpdatedTime, dataCategoryID)
        {
         	var db = DALMain.db;
            try
            {
                db.transaction(function(tx){
                    tx.executeSql("UPDATE DataSyncStatus Set UpdatedOn = ? WHERE DataCategoryID = ?",
									[serverUpdatedTime, dataCategoryID],
                                  	function(){
                                    },
                              		function(){
                        				alert(localizer.translateText("DALDataSyncStatus.settingFailed"));
                                    });
                });
            }
           	catch(err)
            {
				alert(err.message);
                app.mobileApp.hideLoading();
            }
        };

    	DALDataSyncStatus.getServerDataUpdatedOn = function(dataCategoryID, knowledgebaseID, callback){

             var params = {
                            "CategoryID": dataCategoryID ,
                            "KnowledgebaseID": knowledgebaseID
                          };
             WSHandler.sendRequest('GetServerDataUpdatedOn', params,  function(resultTime){
                					var ServerUpdatedTime = JSON.parse(resultTime);
                 					callback(ServerUpdatedTime);
             						},
                                   function(){app.notify(localizer.translateText("DALDataSyncStatus.failedServerTime"), true, false);
                                              app.mobileApp.hideLoading();
                                    });
        }

        DALDataSyncStatus.getServerDataUpdatedOnList = function(knowledgebaseID, callback){

             var params = {
                            "KnowledgebaseID": knowledgebaseID
                          };
             WSHandler.sendRequest('GetServerDataUpdatedOnList', params,  function(records){
                					var recordsList = JSON.parse(records);
                 					callback(recordsList);
             						},
                                   function(){app.notify(localizer.translateText("DALDataSyncStatus.failedServerTime"), true, false);
                                              app.mobileApp.hideLoading();
                                    });
        }

        DALDataSyncStatus.onSuccess = function(tx, results){
            };

        DALDataSyncStatus.onError = function(tr, err){
                alert(localizer.translateText("DALDataSyncStatus.statusError") + " " + err.message);
                app.mobileApp.hideLoading();
            };

        DALDataSyncStatus.checkIsSynchRequired = function(callback){
            var knowledgebaseID =  window.app.config.knowledgebaseID;
            DALDataSyncStatus.getServerDataUpdatedOnList(knowledgebaseID, function(records){
                var oldPrdServerUpdatedOn = records[0];
                var newPrdServerUpdatedOn = records[1];
                var attributesServerUpdatedOn = records[2];
                var rulesServerUpdatedOn = records[3];

                DALDataSyncStatus.getDataSyncStatusList(function(tx, results){
                var isSynchRequired = 'NO';
                if(results.rows.item(0).UpdatedOn < oldPrdServerUpdatedOn || results.rows.item(0).UpdatedOn == null || results.rows.item(1).UpdatedOn < newPrdServerUpdatedOn ||results.rows.item(2).UpdatedOn < attributesServerUpdatedOn ||results.rows.item(3).UpdatedOn < rulesServerUpdatedOn)
                    isSynchRequired = 'YES'
                callback(isSynchRequired);
            });
            });

        };

        app.DALDataSyncStatus = DALDataSyncStatus;
        return DALDataSyncStatus;
});
