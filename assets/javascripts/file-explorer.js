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
        isroot: false,
        config: {
            base_url: '/',
            filters: [],
            hidden_files: false
        },

        constructor: function(config) {
            this.config = extend(this.config, config);
            this.cwd = this.config.base_url;
        },

        open: function() {
            this.emit('open');
            this.cd(this.cwd);
        },

        cd: function(location, relative) {
            if (relative) {
                location = path.join(this.cwd, location);
            }
            location = path.resolve(location);
            this.cwd = location;
            this.isroot = location === '/';

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
                if (self.config.hidden_files 
                        || !self.config.hidden_files && !file.match(/^\./)) {
                    file = { name: file, path: path.join(location, file) };
                    if (fs.statSync(file.path).isDirectory()) {
                        file.type = 'directory';
                        dirs.push(file);
                    } else if (!self.config.filters.length
                            || self._valid(file.name)) {
                        file.type = path.extname(file.name).substring(1);
                        files.push(file);
                    }
                }
            });

            this.emit('changedirectory', dirs.concat(files));
        },

        pwd: function() {
            var segments = this.cwd.split(path.sep);
            if (segments.length > 4) {
                segments.splice(2, segments.length - 4, '...');
            }
            return segments.join(path.sep);
        },

        _valid: function(name) {
            return this.config.filters.indexOf(path.extname(name).substring(1)) > -1;
        }
    });

    return FileExplorer;
});