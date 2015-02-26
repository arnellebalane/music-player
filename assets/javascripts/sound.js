(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define([], func);
    } else {
        root.Sound = func();
    }
})(this, function() {
    function Sound(element, context) {
        this.paused = element.paused;
        var sound = context.createMediaElementSource(element);

        this.play = function() {
            this.paused = false;
            element.play();
        };

        this.pause = function() {
            this.paused = true;
            element.pause();
        };

        this.stop = function() {
            this.paused = true;
            element.currentTime = 0;
            element.pause();
        };

        this.hook = function(destination) {
            sound.connect(destination);
        };
    }

    return Sound;
});