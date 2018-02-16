'use strict';
define([],
function () {
    var utils = {};
    utils.checkMaxLength = function(object){
        if (object.value.length > object.max.length)
            object.value = object.value.slice(0, object.max.length);
    };

    utils.forceNumericDouble = function (){
        var $input = $(this);
        $input.val($input.val().replace(/[^\d,.]+/g,''));
        var output = $input.val().split('.');
        $input.val(output.shift() + (output.length ? '.' + output.join('') : ''));

    }
    utils.forceNumericInteger = function (){
        var $input = $(this);
        $input.val($input.val().replace(/[^\d\'\"]+/g,''));
    }


    utils.forceFeetInches = function () {

            var patterns = new RegExp("^(?!$|.*\'[^\x22]+$)(?:([0-9]+)\')?(?:([0-9]+)\x22?)?$");
            var patternsNumeric = new RegExp("^[0-9]+\.?[0-9]*$");
            var $input = $(this);
            var textVal = $input.val();
            if (textVal.indexOf('.') > -1) {                
                //remove last character from the input's value
                if (patternsNumeric.test(textVal) == false) {
                    $input.val(textVal.substring(0, textVal.length - 1));
                }
            } else if (patterns.test(textVal) == false) {               
                //remove last character from the input's value
                if (!$.isNumeric((textVal.substr(-1))))
                    $input.val(textVal.substring(0, textVal.length - 1));
            }
            $input.blur(function () {
                var textVal = $input.val();
                if (textVal.indexOf('.') > -1) {
                    if (textVal.substring(textVal.indexOf('.')).length <= 1)
                        $input.val(textVal.substring(0, textVal.length - 1));

                    if (patternsNumeric.test(textVal) == false)
                        $input.val('');

                }
                if (textVal.indexOf('"') > -1) {                    
                    if (textVal.substring(textVal.indexOf('"')).length > 1)
                        $input.val(textVal.substring(0, textVal.length - (textVal.substring(textVal.indexOf('"')).length - 1)));
                    
                    if (patterns.test(textVal) == false)
                        $input.val('');

                }

                if (textVal.indexOf("'") > -1) {                    
                   
                    if (textVal.substring(textVal.indexOf("'")).length > 1 && textVal.substring(textVal.indexOf('"')).length < 0){
                        $input.val(textVal.substring(0, textVal.length - (textVal.substring(textVal.indexOf("'")).length - 1)));    
                    }
                    if (patterns.test(textVal) == false)
                        $input.val('');

                }


            });
        }

    return utils;
});