'use strict';

define(['jquery', 'cordova', 'app', 'DALMain'], function($, cordova, app, DALMain){

    var DALAppVersions = {};

    DALAppVersions.success = function()
    {
        console.log("sql command executed successfully.");
    }

    DALAppVersions.fail = function(tx, err){
            console.log(err);            
        };
    


    DALAppVersions.createTable = function(callback)
    {
        var db = DALMain.db;
        var sqlCommand = "CREATE TABLE IF NOT EXISTS AppVersions(VersionId INTEGER, VersionNumber TEXT);";
        db.transaction(function(tx){
            tx.executeSql(sqlCommand,[], callback, DALAppVersions.fail);
        });
    };

    DALAppVersions.dropTable = function()
    {
        var db = DALMain.db;
        var sqlCommand = 'DROP TABLE AppVersions';
        db.transaction(function(tx){
            tx.executeSql(sqlCommand,[], null, DALAppVersions.fail);
        });
    };

    DALAppVersions.getLastVersionID = function(callback)
    {
        DALAppVersions.createTable(function(tx, result){
            var db = DALMain.db;
            var sqlCommand = 'SELECT MAX(VersionId) AS versionId FROM AppVersions';
            db.transaction(function(tx){
                tx.executeSql(sqlCommand,[], function(tx, version){ 
                        if(version.rows.length > 0) 
                            callback(version.rows.item(0).versionId);
                }, DALAppVersions.fail);
            });
        });
        
    };

    DALAppVersions.addVersionNumber = function(versionNo, callback)
    {
        DALAppVersions.isVersionNoExists(versionNo, function(exists){
            if(!exists){
            DALAppVersions.getLastVersionID(function(versionId){
                if(versionId == null)
                    versionId = 0;
                var verId = versionId + 1;
                var db = DALMain.db;
                var sqlCommand = "INSERT INTO AppVersions(VersionId, VersionNumber) VALUES(?, ?)"
                db.transaction(function(tx){
                    tx.executeSql(sqlCommand, [verId, versionNo], callback, DALAppVersions.fail);
                });
            });
        }
        else
        {
            callback();
        }
        });
    };

    DALAppVersions.getLastInstalledVersionNo = function(callback)
    {
        DALAppVersions.getLastVersionID(function(versionId){
            var db = DALMain.db;
            var sqlCommand = "Select * FROM AppVersions WHERE VersionId = ?";
            db.transaction(function(tx){
                tx.executeSql(sqlCommand, [versionId], callback, DALAppVersions.fail);
            }); 
        });
    };

    DALAppVersions.isVersionNoExists = function(versionNo, callback)
    {
        var db = DALMain.db;
        var sqlCommand = "SELECT * FROM AppVersions WHERE VersionNumber = ?";
        db.transaction(function(tx){
            tx.executeSql(sqlCommand, [versionNo], function(tx, record){
                if(record.rows.length > 0 && record.rows.item(0).VersionNumber)
                    callback(true);
                else
                    callback(false);
            });
        });

    };

    return DALAppVersions;
});