(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['stapes', 'mustache', 'player', 'file-explorer', 'slider', 'notifier', 'visualizer'], func);
    } else {
        func(root.Stapes, root.Mustache, root.Player, root.FileExplorer, root.Slider, root.Notifier, root.Visualizer);
    }
})(this, function(Stapes, Mustache, Player, FileExplorer, Slider, Notifier, Visualizer) {
    var templates = {
        null_list_item: $('#null-list-item-template').html(),
        explorer_actions: $('#explorer-actions-template').html(),
        explorer_item: $('#explorer-item-template').html(),
        playlist_item: $('#playlist-item-template').html(),
        notification: $('#notification-template').html()
    };


    var vPlayer = Stapes.subclass({
        constructor: function() {
            this.explorer = new FileExplorer({ filters: ['mp3'] });
            this.slider = new Slider($('.slider-menu'));
            this.player = new Player();
            this.notifier = new Notifier(templates.notification);
            this.visualizer = new Visualizer($('.visualization-body'));
            var self = this;

            this.explorer.on('open', function() {
                self.slider.open('explorer')
                    .actions(templates.explorer_actions)
                    .title('Browse Music')
                    .subtitle(self.explorer.pwd());
            });
                
            this.explorer.on('changedirectory', function(files) {
                self.slider.subtitle(self.explorer.pwd());
                if (files.length) {
                    files.forEach(function(file) {
                        file.actions = file.type !== 'directory';
                    });
                    self.slider.list(files, templates.explorer_item);
                } else {
                    var template = Mustache.render(
                        templates.null_list_item, 
                        { message: 'No music files here.' }
                    );
                    self.slider.empty().append(template);
                }
                if (self.explorer.isroot) {
                    self.slider.actions('');
                } else {
                    self.slider.actions(templates.explorer_actions);
                }
            });

            this.slider.on('actionbutton', function(action) {
                if (action === 'close') {
                    self.slider.close();
                } else if (action === 'back') {
                    self.explorer.cd('..', true);
                }
            });

            this.slider.on('doubleclick', function(item) {
                if (self.slider.mode === 'explorer') {
                    if (item.data('type') === 'directory') {
                        self.explorer.cd(item.data('path'));
                        self.slider.subtitle(self.explorer.pwd());
                    } else if (item.data('type') === 'mp3') {
                        self.player.add(item.data('path'));
                    }
                } else if (self.slider.mode === 'playlist') {
                    self.player.play(item.data('path'));
                        item.siblings()
                            .removeClass('menu-list__item--selected')
                            .find('[data-action="pause"]')
                            .attr('data-action', 'play')
                            .data('action', 'play')
                        item.addClass('menu-list__item--selected')
                            .find('[data-action="play"]')
                            .attr('data-action', 'pause')
                            .data('action', 'pause');
                }
            });

            this.slider.on('itemaction', function(data) {
                var action = data.action;
                var item = data.item;
                if (self.slider.mode === 'explorer') {
                    if (action === 'playlist-add') {
                        self.player.add(item.data('path'));
                    }
                } else if (self.slider.mode === 'playlist') {
                    if (action === 'play') {
                        self.player.play(item.data('path'));
                        item.siblings()
                            .removeClass('menu-list__item--selected')
                            .find('[data-action="pause"]')
                            .attr('data-action', 'play')
                            .data('action', 'play')
                        item.addClass('menu-list__item--selected')
                            .find('[data-action="play"]')
                            .attr('data-action', 'pause')
                            .data('action', 'pause');
                    } else if (action === 'pause') {
                        self.player.pause();
                        item.removeClass('menu-list__item--selected')
                            .find('[data-action="pause"]')
                            .attr('data-action', 'play')
                            .data('action', 'play');
                    }
                }
            });

            this.player.on('data', function(data) {
                self.visualizer.visualize(data);
            });

            this.visualizer.on('playercontrol', function(action) {
                if (action === 'playlist') {
                    self.slider.open('playlist').title('Current Playlist');
                    if (self.player.playlist.length) {
                        self.slider.list(
                            self.player.playlist, 
                            templates.playlist_item
                        );
                        if (self.player.current) {
                            self.slider.get(self.player.index)
                                .addClass('menu-list__item--selected')
                                .find('[data-action="play"]')
                                .attr('data-action', 'pause')
                                .data('action', 'pause');
                        }
                    } else {
                        var template = Mustache.render(
                            templates.null_list_item, 
                            { message: 'There\'s nothing in your playlist.' }
                        );
                        self.slider.empty().append(template);
                    }
                }
            });

            this.explorer.on('error', this.notifier.notify);
            this.player.on('message', this.notifier.notify);
        }
    });
    var vplayer = new vPlayer();


    $(document).on('click', function(e) {
        vplayer.explorer.open();
    });
});