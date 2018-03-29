define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALAuthTokens'],
       function ($, cordova, kendo, app, localizer, WSHandler, DALAuthTokens) {

    var authenticationManager = {};

	var userName = null;
    var password = null;
    var authenticationSucceededCallback = null;
    var authenticationFailedCallback = null

    authenticationManager.authenticateUser = function(userName, password, authenticationSucceededCallback, authenticationFailedCallback){

        authenticationManager.userName = userName;
        authenticationManager.password = password;
        authenticationManager.authenticationSucceededCallback = authenticationSucceededCallback;
        authenticationManager.authenticationFailedCallback = authenticationFailedCallback;

        authenticationManager.checkUserToken(userName, password);
    };

    authenticationManager.checkUserToken =  function(userName, password){
        DALAuthTokens.getActiveToken(userName, password, function(tx, activeTokenInfo){
  			if(activeTokenInfo.rows.length == 0){
                //Valid token does not exist so user must be validated with server
         		var dataToPost = {
                 "LoginName": userName ,
                 "Password": password
             	};
        		WSHandler.sendRequest('AuthenticateUser', dataToPost, authenticationManager.serviceSucceeded, authenticationManager.serviceFailed);
           	}
            else {

                app.setUserToken(authenticationManager.userName);
       			authenticationManager.authenticationSucceededCallback(true);
            }

        }, function(tx, err) {
            alert(err.message);
        });

    };



    // ---- WCF Service call backs -------------------

    authenticationManager.serviceFailed = function (result) {
        authenticationManager.authenticationFailedCallback(result.status + '  ' + result.statusText);
    };

    authenticationManager.serviceSucceeded = function (result){
        if(result.Token != "Invalid"){
        	var authToken = result.Token;
            console.log(result.ExpiresOn.substr(6));
            console.log(result.ExpiresOn);
        	var expiresOn = new Date(result.ExpiresOn);

         	DALAuthTokens.createTable();
        	DALAuthTokens.addAuthToken(authToken, authenticationManager.userName, authenticationManager.password, expiresOn, authenticationManager.tokenSaveSuccess, authenticationManager.tokenSaveError);
       		authenticationManager.authenticationSucceededCallback(true);
        }
        else{
        	authenticationManager.authenticationFailedCallback('Login failed.');
        }
     };

    authenticationManager.tokenSaveSuccess = function (tx, err){
        app.setUserToken(authenticationManager.userName);
    };

	authenticationManager.tokenSaveError = function (tx, err){
        alert(err.message);
    };
    return authenticationManager;

});
