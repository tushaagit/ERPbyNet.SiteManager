'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'fileHandler', 'localizer', 'cookieManager'],
       function ($, cordova, kendo, app, fileHandler, localizer, cookieManager) {

    var trialExpired = kendo.observable({
        beforeShow: function (e) {
            var $view = $('#' + e.view.content.context.id);
            if ($view.length > 0) {
                app.removeCachedViews($view);
            }
        },
        onShow: function() {
            var chkLogin = app.isUserAuthenticated();//call for valid user check method in app page
                    if(chkLogin == false){//check for valid user session
                        app.mobileApp.navigate('app/loginView/view.html');//Not login then goto login page
                    }
        },
        afterShow: function() {
            trialExpired.init();
        }
    });

    app.trialExpired = trialExpired;

    trialExpired.init = function()
    {
        localizer.translate();
        var navbar =  app.mobileApp.view().header.find(".km-navbar").data("kendoMobileNavBar");
        navbar.title(localizer.translateText("trialExpired.trialExp"));
    };

    trialExpired.notify = function(message, error, highlight){
        var notificationClass = '';

        if(error)
            notificationClass = ' class="errorMessage" ';

        if(highlight)
            notificationClass = ' class="highlightMessage" ';

        $("#setupNotificationBox").html( $("#setupNotificationBox").html() + '<p ' + notificationClass + '>' + message + '</p>');
    };



    return trialExpired;
})
