'use strict';
define(['jquery', 'cordova', 'app', 'DALMain', 'WSHandler'],
    function ($, cordova, app, DALMain, WSHandler) {

        var DALErrorLog = {};

        DALErrorLog.dropTable = function () {
            var db = DALMain.db;
            var dropTable = "DROP TABLE IF EXISTS ErrorLog";
            db.transaction(function (tx) {
                tx.executeSql(dropTable, []);
            });
        };

        DALErrorLog.createTable = function (callback) {
            var db = DALMain.db;
            var tblDefinition = "CREATE TABLE IF NOT EXISTS ErrorLog ("
                + " ErrorID INTEGER, "
                + " ErrorDetail TEXT , "
                + "AddedOn TEXTDATETIME, "
                + "IsDeleted INTEGER DEFAULT 0, "
                + " PRIMARY KEY(ErrorID) "
                + " );";
            db.transaction(function (tx) {
                tx.executeSql(tblDefinition, [], function () {
                    if (callback != null)
                        callback();
                },
                    DALErrorLog.onError);
            });
        };

        DALErrorLog.clearData = function () {
            var db = DALMain.db;
            var dropTable = "DELETE FROM  ErrorLog";
            db.transaction(function (tx) {
                tx.executeSql(dropTable, []);
            });
        };

        DALErrorLog.addErrorLog = function (ErrorDetail, errorLogSucceeded, erroLogFailed) {
            var db = DALMain.db;
            var addedOn = new Date();
            var addQuery = "INSERT INTO ErrorLog(ErrorDetail, AddedOn) VALUES(?, ?)";
            db.transaction(function (tx) {
                tx.executeSql(addQuery, [ErrorDetail, addedOn], errorLogSucceeded, erroLogFailed);
            });
        };


        DALErrorLog.onError = function (tr, err) {
            alert("DALErrorLog error: " + err.message);

        };

        DALErrorLog.getLogDetails = function (resultsCallback) {
            var db = DALMain.db;
            try {
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ErrorLog WHERE isDeleted = 0', [], resultsCallback, DALErrorLog.onError)
                });
            }
            catch (err) {
                alert(err.message);
            }
        };


        return DALErrorLog;
    });
