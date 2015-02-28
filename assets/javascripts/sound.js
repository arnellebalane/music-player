(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes'], func);
    } else {
        root.Sound = func(root.Stapes);
    }
})(this, function(Stapes) {
    var Sound = Stapes.subclass({
        constructor: function(element, context) {
            this.element = element;
            this.paused = element.paused;
            this.sound = context.createMediaElementSource(element);
            var self = this;

            element.onended = function() {
                self.emit('end');
            };
        },

        play: function() {
            this.paused = false;
            this.element.play();
        },

        pause: function() {
            this.paused = true;
            this.element.pause();
        },

        stop: function() {
            this.paused = true;
            this.element.currentTime = 0;
            this.element.pause();
        },

        hook: function(destination) {
            this.sound.connect(destination);
        }
    });


    return Sound;
});