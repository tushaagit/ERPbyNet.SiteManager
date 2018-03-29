define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'fileHandler', 'DALGroups',
        'DALSets','DALDataSyncStatus'],
       function ($, cordova, kendo, app, localizer, WSHandler, fileHandler, DALGroups,
                  DALSets, DALDataSyncStatus) {

    var dataSyncManager = {};

    dataSyncManager.init =  function(notificationHandler){
        dataSyncManager.notificationHandler = notificationHandler;
    }

    dataSyncManager.setup = function(callback){
        //Do data sync operations here and then call the callback
        if (callback != null)
          callback();

    }

    dataSyncManager.resultsCallback = function(result, dataCategoryID, clientCallbackHandler, operationSuccessHandler){
        operationSuccessHandler(result, clientCallbackHandler);
        var serverUpdatedTime;
        var knowledgebaseID =  window.app.config.knowledgebaseID;
        DALDataSyncStatus.getServerDataUpdatedOn(dataCategoryID, knowledgebaseID, function(time){
            serverUpdatedTime = time;
        	DALDataSyncStatus.setUpdatedOn(serverUpdatedTime, dataCategoryID);
        });

        //clientCallbackHandler();
    };

    dataSyncManager.buildResultsCallback = function(dataCategoryID, operationSuccessHanlder, clientCallbackHandler){
        return function(result){
            dataSyncManager.resultsCallback(result, dataCategoryID, operationSuccessHanlder, clientCallbackHandler);
        };
    };

    dataSyncManager.populateCategoriesData = function(dataCategoryID, clientCallbackHandler){
        var serverUpdatedTime;
        var knowledgebaseID =  window.app.config.knowledgebaseID;
       	DALDataSyncStatus.getServerDataUpdatedOn(dataCategoryID, knowledgebaseID, function(time){
            serverUpdatedTime = time;
  			DALDataSyncStatus.isLocalDatabaseUpdated(dataCategoryID, serverUpdatedTime, function(tx, result){
                //alert(dataCategoryID + ' time => ' + ServerUpdatedTime + ' => '+' record length : ' + result.rows.length);
                if(result.rows.length > 0){
                    var dataToPost = {};
                    if(dataCategoryID == 1)  {
                        DALOldProductTypes.clearData();
                        dataToPost = { "KnowledgebaseID": knowledgebaseID };
                        //console.log('dataToPost ' + JSON.stringify(dataToPost));
                        WSHandler.sendRequest('GetOldProductTypes', dataToPost, dataSyncManager.buildResultsCallback(dataCategoryID, clientCallbackHandler, DALDataSyncStatus.dataOldPrdTypeSucceeded), DALDataSyncStatus.dataOldPrdTypeFailed);
                    }

                    else if(dataCategoryID == 2){
                        DALNewProductTypes.clearData();
                        WSHandler.sendRequest('GetNewProductTypes', dataToPost, dataSyncManager.buildResultsCallback(dataCategoryID, clientCallbackHandler, DALDataSyncStatus.dataNewPrdTypeSucceeded), DALDataSyncStatus.dataNewPrdTypeFailed);
                    }
                    else if(dataCategoryID == 3){
                       var clientRefreshedOn = result.rows.item(0)['UpdatedOn'];
                       var Params = {
                                    "clientRefreshedOn": clientRefreshedOn ,
                                    "KnowledgebaseID": knowledgebaseID
                                    };
                        //alert(clientRefreshedOn);
                       WSHandler.sendRequest('GetAttributesData', Params, dataSyncManager.buildResultsCallback(dataCategoryID, clientCallbackHandler, DALDataSyncStatus.dataAttributesSucceeded), DALDataSyncStatus.dataAttributesFailed);
                    }
                    else if(dataCategoryID == 4){
                       var clientRefreshedOn = result.rows.item(0)['UpdatedOn'];
                       var Params = {
                                    "clientRefreshedOn": clientRefreshedOn ,
                                    "KnowledgebaseID": knowledgebaseID
                                    };
                        //alert(clientRefreshedOn);
                       WSHandler.sendRequest('GetRulesData', Params, dataSyncManager.buildResultsCallback(dataCategoryID, clientCallbackHandler, DALDataSyncStatus.dataRulesSucceeded), DALDataSyncStatus.dataRulesFailed);
                    }
                }
                else{
                    clientCallbackHandler();
                }
            });
        });

    };

    DALDataSyncStatus.dataOldPrdTypeSucceeded = function(result, clientCallbackHandler){
        var oldPrdtypes = JSON.parse(result);
        //console.log('oldPrdtypes  '+ oldPrdtypes );
        $.each( oldPrdtypes, function( key, value ) {
        	productManager.addOldProductType(oldPrdtypes[key].ProductID, oldPrdtypes[key].ProductName, oldPrdtypes[key].AddedOn,
                                         oldPrdtypes[key].UpDatedOn, oldPrdtypes[key].IsActive, oldPrdtypes[key].IsDeleted);
        });
        DALOldProductTypes.getOldProductTypes(function(tx, oldprds){
            clientCallbackHandler();
        });
    };


    DALDataSyncStatus.dataOldPrdTypeFailed = function(){
        app.notify('Downloading of old product failed', true, false);
        app.mobileApp.hideLoading();
    };

     DALDataSyncStatus.dataNewPrdTypeSucceeded = function(result, clientCallbackHandler){
        var newPrdtypes = JSON.parse(result);
       	$.each( newPrdtypes, function( key, value ) {
        	productManager.addNewProductType(newPrdtypes[key].ProductID, newPrdtypes[key].ProductName, newPrdtypes[key].AddedOn,
                                            newPrdtypes[key].UpdatedOn, newPrdtypes[key].IsActive, newPrdtypes[key].IsDeleted);
            //app.notify('Adding/updating New Product Type "' + newPrdtypes[key].ProductName + '"');
        });

        DALNewProductTypes.getNewProductTypes(function(tx, newprds){
            //app.notify(newprds.rows.length + ' new products added.');
            clientCallbackHandler();
        });
    };


    DALDataSyncStatus.dataNewPrdTypeFailed = function(){
        app.notify('Downloading of new product failed', true, false);
        app.mobileApp.hideLoading();
    };

    DALDataSyncStatus.dataAttributesSucceeded = function(result, clientCallbackHandler){
        console.log('Attribute data succeeded');
        var iAttributesDetails = JSON.parse(result);
        var attributes = iAttributesDetails[0];
        var attributeValues = iAttributesDetails[1];
        var refreshedProductIDs = iAttributesDetails[2];
        var attributeSurveyMappings = iAttributesDetails[3];
        var kbAttributeCategories = iAttributesDetails[4];
        var attributeGroups = iAttributesDetails[5];
        var aRGAttributes = iAttributesDetails[6];
        console.log(attributes);
            DALAttributes.bulkAddAttributes(attributes, function() {
                //console.log('bulkAddAttributes data inserted');
                DALAttributeValues.bulkAddAttributeValues(attributeValues, function() {
                    //console.log('insertAttributeValues data inserted');
                    DALAttributeSurveyMappings.bulkAddAttributeSurveyMappings(attributeSurveyMappings, function(){
                        //console.log('bulkAddAttributeSurveyMappings data inserted');
                        DALKbAttributeCategories.bulkAddKBAttributeCategories(kbAttributeCategories, function() {
                            //console.log('bulkAddKBAttributeCategories data inserted');
                            DALAttributeGroups.bulkAddAttributeGroups(attributeGroups, function() {
                                //console.log('bulkAddAttributeGroups data inserted');
                                DALARGAttributes.bulkAddARGAttribute(aRGAttributes, function () {
                                    //console.log('bulkAddARGAttribute data inserted');
                                    clientCallbackHandler();
                                });
                            });
                        })
                    })
                });
            }, function(){
                     //app.notify('Survey definition data sync in progress. Please wait...');
                    DALAttributes.getAllAttributes(function(tx, attrs){
                        app.notify(attrs.rows.length + ' attributes added.');
                        DALAttributeValues.getAllAttributeValues(function(tx, attrs){
                            app.notify(attrs.rows.length + ' attribute values added.');
                            DALAttributeSurveyMappings.getAllAttributeSurveyMappings(function(tx, attrs){
                                app.notify(attrs.rows.length + ' attribute Survey Mappings values added.');
                                clientCallbackHandler();
                            });
                        });
                    });

            });








    };

    DALDataSyncStatus.insertAttributeValues = function(attributeValues, clientCallbackHandler) {
        $.each( attributeValues, function( key, value ) {
           //console.log(attributeValues[key].ProductID + "-" + attributeValues[key].AttributeName +"-"+ attributeValues[key].ValueName);
            if(attributeValues[key].PhotoFileName != null && attributeValues[key].PhotoFileName != ''){

                    var prefix = app.config.attributeValuesImgPath;

                	var sourceURL = prefix + attributeValues[key].PhotoFileName + attributeValues[key].PhotoFileExtension;
                	var targetFileName = attributeValues[key].PhotoFileName + attributeValues[key].PhotoFileExtension;
            		//app.notify('Downloading this image for Value: ' + + attributeValues[key].AttributeName + '->' + attributeValues[key].ValueName + '->' + sourceURL);

                	fileHandler.downloadAttributeImagesFromServer(sourceURL, targetFileName,  DALDataSyncStatus.saveValueRecordWrapper(attributeValues[key]));
            }
            else {
            	attributeValueManager.addAttributeValue(attributeValues[key].ProductID, attributeValues[key].AttributeID, attributeValues[key].AttributeName, attributeValues[key].AttributeValueID,
                                                   attributeValues[key].ValueName, attributeValues[key].ValueDesc, attributeValues[key].IsPhotoRequired, attributeValues[key].PhotoFileName,
                                                    attributeValues[key].PhotoFileExtension, attributeValues[key].PhotoDisplayName, attributeValues[key].SequenceNo);

            }
            //app.notify('Adding/updating attribute value "' + attributeValues[key].ValueDesc + '" for attribute "' + attributeValues[key].AttributeName + '"' );
        });
        clientCallbackHandler();
    }

    DALDataSyncStatus.updateAttributePhotoFileNameWrapper = function(productID, surveyTypeID, attributeID){
                    return function(savedFileURL){
                         DALDataSyncStatus.updateAttributePhotoFileName(savedFileURL, productID, surveyTypeID, attributeID);
                    }
    };

    DALDataSyncStatus.updateAttributePhotoFileName = function(photoFileName, productID, surveyTypeID, attributeID){
        attributeManager.updateAttributePhotoFileName(productID, surveyTypeID, attributeID, photoFileName);
    };


    DALDataSyncStatus.updateAttributeReferenceDrawingFileNameWrapper = function(productID, surveyTypeID, attributeID){
                    return function(savedFileURL){
                         DALDataSyncStatus.updateAttributePhotoFileName(savedFileURL, productID, surveyTypeID, attributeID);
                    }
    };

    DALDataSyncStatus.updateAttributeReferenceDrawingFileName = function(referenceDrawingFileName, productID, surveyTypeID, attributeID){
        attributeManager.updateAttributeReferenceDrawingFileName(productID, surveyTypeID, attributeID, referenceDrawingFileName);
    };

    DALDataSyncStatus.saveValueRecord = function(savedFileURL, attributeValueToBeSaved){
        //alert('saveValueRecord ' + savedFileURL);
        attributeValueManager.addAttributeValue(attributeValueToBeSaved.ProductID,attributeValueToBeSaved.AttributeID, attributeValueToBeSaved.AttributeName,
                                                attributeValueToBeSaved.AttributeValueID,
                                       attributeValueToBeSaved.ValueName, attributeValueToBeSaved.ValueDesc, attributeValueToBeSaved.IsPhotoRequired,
                                                savedFileURL,
                                        attributeValueToBeSaved.PhotoFileExtension, attributeValueToBeSaved.PhotoDisplayName, attributeValueToBeSaved.SequenceNo);

        //app.notify('Adding/updating attribute value "' + attributeValueToBeSaved.ValueDesc + '" for attribute "' + attributeValueToBeSaved.AttributeName + '"' );

    };

    DALDataSyncStatus.dataRulesSucceeded = function(result, clientCallbackHandler){
        var iRulesDetails = JSON.parse(result);
        var rules = iRulesDetails[0];
        var refreshedProductIDs = iRulesDetails[1];

        DALRules.bulkAddRule(rules, function() {
            //console.log('Rules added');
            clientCallbackHandler();
        });

    }

    DALDataSyncStatus.dataAttributesFailed = function(){
        app.notify('Attributes data failed', true, false);
        app.mobileApp.hideLoading();
    };

    DALDataSyncStatus.dataRulesFailed = function(){
        app.notify('Rules data failed', true, false);
        app.mobileApp.hideLoading();
    };

    DALDataSyncStatus.saveValueRecordWrapper = function(attributeValueToBeSaved){
                    return function(savedFileURL){
                        //alert(savedFileURL);
                         DALDataSyncStatus.saveValueRecord(savedFileURL, attributeValueToBeSaved);
                    }
    }

    DALDataSyncStatus.dataAttributesFailed = function(){
        app.notify('Attributes data failed', true, false);
        app.mobileApp.hideLoading();
    };

    return dataSyncManager;
});
