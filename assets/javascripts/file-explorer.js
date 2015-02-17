(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes', 'scripts/extend'], func);
    } else {
        root.FileExplorer = func(root.Stapes);
    }
})(this, function(Stapes, extend) {
    var fs = node_require('fs');
    var path = node_require('path');

    var FileExplorer = Stapes.subclass({
        cwd: '/',
        config: {
            base_url: '/',
            filters: []
        },

        constructor: function(config) {
            this.config = extend(this.config, config);
            this.cwd = this.config.base_url;
        },

        open: function() {
            this.emit('open');
            this.cd(this.cwd);
        },

        cd: function(location) {
            this.cwd = location;

            var self = this;
            var dirs = [];
            var files = [];

            fs.readdirSync(location).forEach(function(file) {
                if (fs.statSync(path.join(location, file)).isDirectory()) {
                    dirs.push(file);
                } else if (self._valid(file)) {
                    files.push(file);
                }
            });

            this.emit('changedirectory', dirs.concat(files));
        },

        _valid: function(file) {
            return this.config.filters.indexOf(path.extname(file).substring(1)) > -1;
        }
    });

    return FileExplorer;
});