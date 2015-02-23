(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes', 'sound'], func);
    } else {
        root.Player = func(root.Stapes, root.Sound);
    }
})(this, function(Stapes, Sound) {
    var path = node_require('path');


    var Player = Stapes.subclass({
        constructor: function() {
            this.data_size = 1024;
            this.index = 0;
            this.current = null;
            this.playlist = [];

            this.context = new AudioContext();
            this.processor = this.context.createScriptProcessor(this.data_size);
            this.analyser = this.context.createAnalyser();
            this.data = new Uint8Array(this.analyser.frequencyBinCount);

            this.processor.connect(this.context.destination);
            this.analyser.connect(this.processor);

            var self = this;

            this.processor.onaudioprocess = function() {
                self.analyser.getByteTimeDomainData(self.data);
                self.emit('data', self.data);
            };
        },

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
