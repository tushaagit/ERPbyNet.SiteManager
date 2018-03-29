'use strict';
define([],
function () {
    var utils = {};
    utils.checkMaxLength = function(object){
        if (object.value.length > object.max.length)
            object.value = object.value.slice(0, object.max.length);
    };

    return utils;
});
