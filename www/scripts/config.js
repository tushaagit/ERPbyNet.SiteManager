'use strict';
define(['DALConfigParams'],
function (DALConfigParams) {

    var config = {
        initialized: true,
        trialPeriod: 100,
        attributeFilesFolder: "attributeImages",
        tokenLife: 2,
        servicePath: "http://TKEAPI.erpbynet.com/api/",//"http://konetestapi.xecomit.com/api/",//http://koneerpbynetapi.azurewebsites.net/api/", //"http://TKEAPI.erpbynet.com/api/",//"http://localhost:59683/api/",// "http://koneerpbynetapi.azurewebsites.net/api/",////  //"http://sssdemoapi.xecomit.com/api/",//,
        mediaServicePath: "http://TKEAPI.erpbynet.com/api/",//
        knowledgebaseID:45,
        company: "XECOM IT",
        isSchemaUpdateNeeded : true,
        appVersion: '1.0.6',
        attributesPhotoPath: "http://tkeaus4.xecomit.com/AttributesFiles/Attributes/PhotoFiles/",
        attributesDwgPath: "http://tkeaus4.xecomit.com/AttributesFiles/Attributes/ReferenceDrawing/",
        attributeValuesImgPath: "http://tkeaus4.xecomit.com/AttributesFiles/AttributesValue/",
        allAddingProjects: false,
        displayInlineHelp: false,
        allowPartialSurveyDataUpload:true,
        defaultSurveyTypeID: 4,
        userCartMappingForAttributes: false
    };

    config.loadConfiguration = function(callback){
        //console.log('config.loadConfiguration');
        DALConfigParams.getConfigDetails(function(tx, result){
            if(result.rows.length > 0){
                config.initialized = true;
                config.attributesPhotoPath = result.rows.item(0).AttributesPhotoPath;
                config.attributesDwgPath = result.rows.item(0).AttributesDwgPath;
                config.attributeValuesImgPath = result.rows.item(0).AttributeValuesImgPath;
            }
            else{
                config.attributesPhotoPath = null;
                config.attributesDwgPath = null;
                config.attributeValuesImgPath = null;
            }

             if(callback != null)
                callback();
        });
    };


    return config;
});
