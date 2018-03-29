'use strict';


define(['jquery', 'cordova', 'config'],
       function ($, cordova, config) {

	var WSHandler = {};
    //WSHandler.serverURL = config.servicePath;
    //WSHandler.serverURL = "http://sss.erpbynet.com/smartsitesurveyservice.svc/";
    //WSHandler.serverURL = "http://apidemo.erpbynet,com/smartsitesurveyservice.svc/";

    WSHandler.initialize = function () {
    };

    WSHandler.sendRequest = function(operation, dataToBeSent, serviceSucceeded, serviceFailed) {

        //alert(app.config.servicePath + '   ->   '+ operation);
        //console.log(operation);
            $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.app.config.servicePath + operation,
           	contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: false,
			data: JSON.stringify(dataToBeSent),
            success: serviceSucceeded,
            error: serviceFailed
        });
    };

     WSHandler.sendGetRequest = function(operation, dataToBeSent, serviceSucceeded, serviceFailed) {
            $.ajax({
            type: "POST",
            crossDomain: true,
            url: window.app.config.servicePath + operation,
           	contentType: "application/json; charset=utf-8",
            dataType: "json",
            processData: true,
			data: JSON.stringify(dataToBeSent),
            success: serviceSucceeded,
            error: serviceFailed
        });
    };

    return WSHandler;

});
