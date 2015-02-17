(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define([], func);
    } else {
        root.Sound = func();
    }
})(this, function() {
    /*
     * @param element - the Audio element to be wrapped
     */
    function Sound(element, context) {
        this.paused = element.paused;
        var sound = null;

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

        this.hook = function(context, destination) {
            if (!sound) {
                sound = context.createMediaElementSource(element);
            }
            sound.connect(destination);
        };
    }

    return Sound;
});