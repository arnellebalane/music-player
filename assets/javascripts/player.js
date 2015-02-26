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
                var self = this;
                this.load(item.path).then(function(audio) {
                    item.sound = new Sound(audio, self.context);
                    item.sound.hook(self.analyser);
                    item.sound.hook(self.context.destination);
                });
                self.playlist.push(item);
                self.emit('message', item.name + ' added to playlist.');
            }
            return this;
        },

        load: function(filepath) {
            return new Promise(function(resolve, reject) {
                var audio = new Audio();
                audio.addEventListener('canplay', function() {
                    resolve(audio);
                });
                audio.addEventListener('error', reject);
                audio.src = filepath;
                resolve(audio);
            });
        },

        play: function(filepath) {
            if (this.current && this.current.path !== filepath) {
                this.current.sound.stop();
            }
            if (filepath && (!this.current || this.current.path !== filepath)) {
                for (var i = 0, l = this.playlist.length; i < l; i++) {
                    if (this.playlist[i].path === filepath) {
                        this.index = i;
                        break;
                    }
                }
                this.current = this.playlist[this.index];
                this.current.sound.play();
            } else if (this.current) {
                this.current.sound.play();
            }
            return this;
        },

        pause: function() {
            this.current.sound.pause();
            return this;
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
