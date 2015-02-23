(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['stapes', 'player', 'file-explorer', 'slider', 'notifier', 'visualizer'], func);
    } else {
        func(root.Stapes, root.Player, root.FileExplorer, root.Slider, root.Notifier, root.Visualizer);
    }
})(this, function(Stapes, Player, FileExplorer, Slider, Notifier, Visualizer) {
    var templates = {
        null_list_item: $('#null-list-item-template').html(),
        explorer_actions: $('#explorer-actions-template').html(),
        explorer_item: $('#explorer-item-template').html(),
        notification: $('#notification-template').html()
    };


    var vPlayer = Stapes.subclass({
        constructor: function() {
            this.explorer = new FileExplorer({
                base_url: '/home/arnelle/Downloads',
                filters: ['mp3'] 
            });
            this.slider = new Slider($('.slider-menu'));
            this.player = new Player();
            this.notifier = new Notifier(templates.notification);
            this.visualizer = new Visualizer($('.visualization-container'));
            var self = this;

            this.explorer.on('open', function() {
                self.slider.open().actions(templates.explorer_actions);
                self.slider.title('Browse Music').subtitle(self.explorer.pwd());
            });
                
            this.explorer.on('changedirectory', function(files) {
                self.slider.subtitle(self.explorer.pwd());
                if (files.length) {
                    self.slider.list(files, templates.explorer_item);
                } else {
                    self.slider.empty().append(templates.null_list_item);
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
                if (item.data('type') === 'directory') {
                    self.explorer.cd(item.data('path'));
                    self.slider.subtitle(self.explorer.pwd());
                } else if (item.data('type') === 'mp3') {
                    self.player.add(item.data('path'));
                }
            });

            this.player.on('data', function(data) {
                self.visualizer.visualize(data);
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