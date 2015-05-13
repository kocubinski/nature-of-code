var ui = ui || {};

ui.live = false;

ui.bindModelInput = function(obj, property, domElem) {
    Object.defineProperty(obj, property, {
        get: function() { return domElem.value; },
        set: function(newValue) { domElem.value = newValue; },
        configurable: true
    });
};

ui.setup = function(){
    if (ui.live) {
        document.addEventListener("DOMContentLoaded", function(event) {
            setup();
        });
    } else {
        setup();
    }
};
