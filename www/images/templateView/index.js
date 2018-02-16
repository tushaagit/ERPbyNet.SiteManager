'use strict';
define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler'],
       function ($, cordova, kendo, app, localizer, WSHandler) {
   
    var templateView =  kendo.observable({
        onShow: function(e) {},
        afterShow: function(e) {
             templateView.init();
        }
    });
    
    app.templateView = templateView;
    
    templateView.init = function(){
        //Do any initialization required here
    }

    templateView.set('title', 'Template View');
    
    return templateView;
});
// START_CUSTOM_CODE_settingsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
// END_CUSTOM_CODE_settingsView