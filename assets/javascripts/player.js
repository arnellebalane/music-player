(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes', 'sound'], func);
    } else {
        root.Player = func(root.Stapes, root.Sound);
    }
})(this, function(Stapes, Sound) {
    var path = node_require('path');


    var Player = Stapes.subclass({
        index: 0,
        current: null,
        playlist: [],

        add: function(filepath) {
            var item = { path: filepath, name: path.basename(filepath) };
            var found = false;
            for (var i = 0, l = this.playlist.length; i < l && !found; i++) {
                found = this.playlist[i].path === item.path;
            }
            if (found) {
                this.emit('message', item.name + ' is already in the playlist.');
            } else {
                this.playlist.push(item);
                this.emit('message', item.name + ' added to playlist.');
            }
            return this;
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
