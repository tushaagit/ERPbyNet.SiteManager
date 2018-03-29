define(['jquery', 'cordova', 'kendo', 'hashTable', 'localizer'],
       function ($, cordova, kendo, hashTable, localizer) {
           //http://stackoverflow.com/questions/9486645/javascript-how-to-store-predefined-function-with-arguments
    var functionQueue = {};

    functionQueue.running = false;

    functionQueue.queue = [];

    functionQueue.add = function(func, args, thisarg) {
        var _this = this;
        //add callback to the queue
        this.queue.push(function(){
            var finished = func.apply(thisarg, args);
            //console.log('finished ' + finished);
            if(typeof finished === "undefined" || finished) {
               //  if callback returns `false`, then you have to
               //  call `next` somewhere in the callback
               _this.next();
            }
        });

        if(!this.running) {
            // if nothing is running, then start the engines!
            this.next();
        }

        return this; // for chaining fun!
    }

    functionQueue.next = function(){
        //console.log('this.running ' + this.running);
        this.running = false;
        //get the first element off the queue
        var shift = this.queue.shift();
        //console.log('shift ' + shift);
        if(shift) {
            this.running = true;
            shift();
        }
    }

    return functionQueue;

});
