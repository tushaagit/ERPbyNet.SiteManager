define(['jquery', 'cordova', 'kendo', 'app', 'localizer', 'WSHandler', 'DALTrialVersion', 'config'],
       function ($, cordova, kendo, app, localizer, WSHandler, DALTrialVersion, config) {
   
    var trialManager = {};
    
    trialManager.isTrialStillAvailable = function(callback){
        
        var currentDate = new Date();
        var trialLimit =  config.trialPeriod;
        var limitDate =  new Date(currentDate.setDate(currentDate.getDate() - trialLimit));

        DALTrialVersion.isTrialStillAvailable(limitDate, function(trialAvailable){
           if(callback != null) {
               callback(trialAvailable);
           }          
        });
    }    

    return trialManager;
});