define(['jquery', 'cordova', 'DALMain', 'DALAuthTokens', 'DALOpportunities'],
       function ($, cordova, DALMain, DALAuthTokens, DALOpportunities) {

	var DALLoader = {};
    
    
    DALLoader.init = function(){
        DALMain.init();
        DALAuthTokens.init();
        DALOpportunities.init();
    };  
    
    return DALLoader;
});