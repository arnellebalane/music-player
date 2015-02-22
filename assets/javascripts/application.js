(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['stapes', 'player', 'file-explorer', 'slider', 'notifier', 'visualizer'], func);
    } else {
        func(root.Stapes, root.Player, root.FileExplorer, root.Slider, root.Notifier, root.visualizer);
    }
})(this, function(Stapes, Player, FileExplorer, Slider, Notifier, visualizer) {
    var templates = {
        file_explorer: $('#explorer-item-template').html(),
        notification: $('#notification-template').html()
    };


    var vPlayer = Stapes.subclass({
        constructor: function() {
            this.explorer = new FileExplorer({
                base_url: '/home/arnelle/Downloads',
                filters: ['mp3'] 
            });
            this.slider = new Slider(
                $('.slider-menu'), 
                $('.slider-menu__title'), 
                $('.slider-menu .menu-list')
            );
            this.notifier = new Notifier(templates.notification);
            var self = this;

            this.explorer.on('open', function() {
                self.slider.open('explorer', 'Browse Music');
            });
                
            this.explorer.on('changedirectory', function(files) {
                self.slider.list(files, templates.file_explorer);
            });

            this.explorer.on('error', this.notifier.notify);

            this.slider.on('doubleclick', function(item) {
                if (item.data('type') === 'directory') {
                    self.explorer.cd(item.data('path'));
                }
            });
        }
    });
    var vplayer = new vPlayer();


    $(document).on('click', function(e) {
        vplayer.explorer.open();
    });
});