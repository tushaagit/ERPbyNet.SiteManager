'use strict';

define(['jquery', 'cordova'],
       function ($, cordova) {
    
    var networkInfo = {};
    
    //networkInfo.messageConnectionType = null; 
    //networkInfo.currentTimeDiv = null;
    
    networkInfo.init = function() {   
		var networkState = navigator.connection.type;        
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
		
        networkInfo.connectionType = states[networkState];
        
        var now = new Date().toLocaleTimeString().split(" ")[0];				
        networkInfo.currentTimeDiv = now;
        
 	};
    
	//networkInfo.init();
           

   	return networkInfo; 
});