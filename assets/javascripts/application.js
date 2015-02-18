(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['stapes', 'scripts/player', 'scripts/file-explorer', 'scripts/slider', 'scripts/visualizer'], func);
    } else {
        func(root.Stapes, root.Player, root.FileExplorer, root.Slider, root.visualizer);
    }
})(this, function(Stapes, Player, FileExplorer, Slider, visualizer) {
    var templates = {
        file_explorer: $('#explorer-item').html()
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
            var self = this;

            this.explorer.on('open', function() {
                self.slider.open('Browse Music');
            });

            this.explorer.on('changedirectory', function(files) {
                self.slider.list(files, templates.file_explorer);
            });
        }
    });
    var vplayer = new vPlayer();


    $(document).on('click', function(e) {
        vplayer.explorer.open();
    });
});