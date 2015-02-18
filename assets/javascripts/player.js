(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes', 'sound'], func);
    } else {
        root.Player = func(root.Stapes, root.Sound);
    }
})(this, function(Stapes, Sound) {
    var Player = Stapes.subclass({
        index: 0,
        current: null,
        playlist: [],

        constructor: function() {
            console.info('Initializing new Player object...');
        },

        play: function() {

        },

        pause: function() {

        },

        stop: function() {

        },

        previous: function() {

        },

        next: function() {

        }
    });

    return Player;
});
