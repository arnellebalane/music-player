(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['stapes', 'extend'], func);
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
            location = path.resolve(location);
            this.cwd = location;

            var self = this;
            var dirs = [];
            var files = [];

            try {
                var contents = fs.readdirSync(location);
            } catch (e) {
                this.emit('error', 'Permission Denied.');
                return;
            }

            contents.forEach(function(file) {
                file = { name: file, path: path.join(location, file) };
                if (fs.statSync(file.path).isDirectory()) {
                    file.type = 'directory';
                    dirs.push(file);
                } else if (!self.config.filters.length
                        || self._valid(file.name)) {
                    file.type = path.extname(file.name).substring(1);
                    files.push(file);
                }
            });

            if (location !== '/') {
                dirs.unshift({ 
                    name: '(parent directory)', 
                    path: path.join(location, '..'),
                    type: 'directory'
                });
            }

            this.emit('changedirectory', dirs.concat(files));
        },

        _valid: function(name) {
            return this.config.filters.indexOf(path.extname(name).substring(1)) > -1;
        }
    });

    return FileExplorer;
});