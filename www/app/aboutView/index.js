'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'config'],
    function ($, cordova, kendo, app, localizer,  config) {
    var aboutView =  kendo.observable({
        beforeShow: function (e) {
            var $view = $('#' + e.view.content.context.id);
            if ($view.length > 0) {
                app.removeCachedViews($view);
            }
        },
        onShow:function(){
            var chkLogin = app.isUserAuthenticated();

                if(chkLogin == false){
                    app.mobileApp.navigate('app/loginView/view.html');
                }
        },
        afterShow:function(){
            var versionNumber= window.app.config.appVersion;//get the version number from config file
            $("#versionNumber").html("Version: "+versionNumber);//Display version number.
            localizer.translate();
        }
    });
    app.aboutView = aboutView;
    return aboutView;
});
