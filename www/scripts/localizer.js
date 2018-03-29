'use strict';

define(['jquery', 'cordova', 'en', 'en_US'],
       function ($, cordova, en, en_US, hi_IN, ja_JP, pt) {

	var localizer = {};
    localizer.browserLanguage = navigator.language || navigator.userLanguage; //Get the browser or device language


   	localizer.dictionary = en; //Default dictionary
    //alert(localizer.browserLanguage);
    if( localizer.browserLanguage === 'en-US'){
        localizer.dictionary = en_US;
    }
    else if( localizer.browserLanguage === 'hi' || localizer.browserLanguage === 'hi-IN'){
        localizer.dictionary = hi_IN;
    }
    else if( localizer.browserLanguage === 'ja' || localizer.browserLanguage === "ja-JP")
    {
		localizer.dictionary = ja_JP;
    }
    else if(localizer.browserLanguage === "ko-KR")
   	{
		localizer.dictionary = ja_JP;
    }
    else if(localizer.browserLanguage === "pt")
    {
        localizer.dictionary = pt;
    }

 	localizer.translate = function(){
        var elements = $('[loc-text]');
    	elements.each(function(index){
      		var orgText = $(this).attr('loc-text');
            var partText = orgText.split(" ");
            var locText = '';
            for(var i=0; i<partText.length; i++)
                {
                    locText = locText+localizer.dictionary[partText[i]] + " ";
                }
            locText = locText.substring(0, locText.length-1);
            $(this).text(locText);
        });

        var elements = $('[loc-ErrorText]');
    	elements.each(function(index){
      		var orgText = $(this).attr('loc-ErrorText');
            var partText = orgText.split(" ");
            var locText = '';
            for(var i=0; i<partText.length; i++)
                {
                    locText = locText+localizer.dictionary[partText[i]] + " ";
                }
            locText = locText.substring(0, locText.length-1);
            $(this).attr("validationMessage", locText);
        });
    };

    localizer.translateText = function(textKey){
        return(localizer.dictionary[textKey]);
    };

    localizer.translateDynamicText = function (staticText, parameters) {
        var dynamicPart = parameters.toString();
        var translatedText = localizer.translateText(staticText);
        var splitDynText = dynamicPart.split(",");
        for(var i=0; i<splitDynText.length; i++)
        {
            translatedText = translatedText.replace("{" + i + "}", splitDynText[i]);
        }
        return translatedText;
    };

    return localizer;
});
