'use strict';

define(['app', 'jquery'],
    function (app, $) {
        var cookieManager = {};

        cookieManager.writeCookie =
            function (name, value, days) {
                var date, expires;
                
                if (days > 0) {
                    date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                } else {
                    expires = "";
                }
                document.cookie = name + "=" + value + expires + "; path=/";
                //window.localStorage.setItem(name, value);
                //sessionStorage.setItem(name, value);
                window.localStorage.setItem(name, name + "=" + value + expires);
            };



        cookieManager.readCookie =
            function readCookie(name) {
                //return sessionStorage.getItem(name);
                return window.localStorage.getItem(name);
            };
            
            cookieManager.isExpired = function(name){
                var cookie =  cookieManager.readCookie(name);
                
                if(cookie.lastIndexOf('expires') > 0){
                    var expires = cookie.substring(cookie.lastIndexOf("=") + 1 );

                    
                    return (new Date() < new Date(expires));
                }
                else{
                    return true;
                }
            };

            cookieManager.deleteAllCookies =
            function () {

                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];

                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;

                    document.cookie = name + "='';expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";

                }

            };
        return cookieManager;

    });