'use strict';
define(['jquery', 'cordova', 'app', 'localizer', 'DALMain', 'WSHandler'],
    function ($, cordova, app, localizer, DALMain, WSHandler) {

        var DALConfigParams = {};

        DALConfigParams.dropTable = function () {
            
            var db = DALMain.db;
            var dropTable = "DROP TABLE IF EXISTS ConfigParams";
            db.transaction(function (tx) {
                tx.executeSql(dropTable, []);
            });
        };

        DALConfigParams.createTable = function (callback) {
            
            var db = DALMain.db;
            var tblDefinition = "CREATE TABLE IF NOT EXISTS ConfigParams ("
                + " ConfigID INTEGER, "
                + " TokenLife TEXT , "
                + " ServicePath TEXT , "
                + " MediaServicePath TEXT , "
                + " KnowledgebaseID TEXT , "
                + " Company TEXT , "
                + " AttributesPhotoPath TEXT ,"
                + " AttributesDwgPath TEXT ,"
                + " AttributeValuesImgPath TEXT ,"
                + " AddedOn TEXTDATETIME, "
                + " UpdatedOn TEXTDATETIME,"
                + " IsDeleted INTEGER DEFAULT 0, "
                + " PRIMARY KEY(ConfigID) "
                + " );";
            db.transaction(function (tx) {
                tx.executeSql(tblDefinition, [], function () {
                    if (callback != null)
                        callback();
                },
                    DALConfigParams.onError);
            });
        };

        DALConfigParams.clearData = function () {
            var db = DALMain.db;
            var dropTable = "DELETE FROM  ConfigParams";
            db.transaction(function (tx) {
                tx.executeSql(dropTable, []);
            });
        };

        DALConfigParams.setConfigParams = function (tokenLife, servicePath, mediaServicePath, knowledgebaseID, company, configSaveSucceeded, configSaveFailed) {
            
            var db = DALMain.db;
            var addedOn = new Date();
            db.transaction(function (tx) {
                tx.executeSql("SELECT tokenLife, servicePath FROM ConfigParams ",
                    [],
                    function (tx, configParams) {
                        if (configParams.rows.length > 0) {
                            
                            db.transaction(function (tx) {
                                tx.executeSql("UPDATE ConfigParams SET TokenLife = ?, ServicePath = ?, MediaServicePath = ?, KnowledgebaseID = ?, Company = ?, UpdatedOn = ?, IsDeleted = ?",
                                    [tokenLife, servicePath, mediaServicePath, knowledgebaseID, company, addedOn, 0],
                                    configSaveSucceeded, configSaveFailed
                                );
                            });
                        }
                        else {
                            
                            db.transaction(function (tx) {
                                tx.executeSql("INSERT INTO ConfigParams (TokenLife, ServicePath, MediaServicePath, KnowledgebaseID, Company, AddedOn, UpdatedOn, IsDeleted) VALUES(?, ?, ?, ?, ?, ?, ?, ?) ",
                                    [tokenLife, servicePath, mediaServicePath, knowledgebaseID, company, addedOn, addedOn, 0],
                                    configSaveSucceeded, configSaveFailed
                                );
                            });

                        }
                    });
            });
        };
        
        DALConfigParams.getGUID = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        DALConfigParams.setPathsConfigData = function (callback) {
            var db = DALMain.db;
            var addedOn = new Date();
            var rowGUID = DALConfigParams.getGUID();
            var dataToPost = {};
            WSHandler.sendRequest('GetConfigParametes', dataToPost, function (parameters) {
                var configParams = JSON.parse(parameters);
                //alert("config : " + configParams);
                var attributesPhotoPath = configParams[0];
                var attributesDwgPath = configParams[1];
                var attributeValuesImgPath = configParams[2];


                db.transaction(function (tx) {
                    tx.executeSql("SELECT AttributesPhotoPath FROM ConfigParams ",
                        [],
                        function (tx, configParams) {
                            if (configParams.rows.length > 0) {
                                db.transaction(function (tx) {
                                    tx.executeSql("UPDATE ConfigParams SET AttributesPhotoPath = ?, AttributesDwgPath = ?, AttributeValuesImgPath = ?, UpdatedOn = ?, IsDeleted = ?",
                                        [attributesPhotoPath, attributesDwgPath, attributeValuesImgPath, addedOn, 0],
                                        callback, DALConfigParams.onError
                                    );
                                });
                            }
                            else {
                                db.transaction(function (tx) {
                                    tx.executeSql("INSERT INTO ConfigParams (AttributesPhotoPath, AttributesDwgPath, AttributeValuesImgPath, AddedOn, UpdatedOn, IsDeleted) VALUES (?, ?, ?, ?, ?, ?)",
                                        [attributesPhotoPath, attributesDwgPath, attributeValuesImgPath, addedOn, addedOn, 0],
                                        callback, DALConfigParams.onError
                                    );
                                });

                            }
                        });
                });

            }
                ,
                function () { app.notify(localizer.translateText("DALConfigParams.configParamFailed"), true, false); });
        };

        DALConfigParams.onSuccess = function (tx, results) {

        };

        DALConfigParams.onError = function (tr, err) {
            alert(localizer.translateText("DALConfigParams.configError") + " " + err.message);

        };

        DALConfigParams.getConfigDetails = function (resultsCallback) {
            var db = DALMain.db;
            try {
                
                db.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ConfigParams WHERE isDeleted = 0', [], resultsCallback, DALConfigParams.onError)
                });
            }
            catch (err) {
                alert(err.message);
            }
        };

        // app.DALDataSyncStatus = DALConfig;
        return DALConfigParams;
    });