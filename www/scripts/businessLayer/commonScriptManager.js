define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler'],
       function ($, cordova, kendo, app, localizer, WSHandler) {

    var commonScriptManager = {};

   commonScriptManager.parseDateMMDDYY = function(date){

        var dd = date.getDate();
        var mm = date.getMonth()+1; //January is 0!
        var yyyy = date.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        var date = mm+'/'+dd+'/'+yyyy;
       return date;
   }

    return commonScriptManager;
});
