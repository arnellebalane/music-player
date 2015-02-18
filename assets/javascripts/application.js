(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['mustache', 'scripts/player', 'scripts/file-explorer', 'scripts/visualizer'], func);
    } else {
        func(root.Mustache, root.Player, root.FileExplorer, root.visualizer);
    }
})(this, function(Mustache, Player, FileExplorer, visualizer) {
    var templates = {
        file_explorer: $('#explorer-item').html()
    };

    var explorer = new FileExplorer({ base_url: '/home/arnelle/Downloads', filters: ['mp3'] });

    var slider = {
        $element: $('.slider-menu'),
        $title: $('.slider-menu .slider-menu__title'),
        $list: $('.slider-menu .menu-list'),

        initialize: function() {
            var self = this;
            this.$element.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(e.target).hasClass('close-button')) {
                    self.$element.removeClass('slider-menu--opened');
                }
            });
        },

        open: function(title) {
            this.$title.text(title);
            this.$element.addClass('slider-menu--opened');
        },

        list: function(items, format) {
            var self = this;
            this.$list.empty();
            items.forEach(function(item) {
                item = Mustache.render(format, item);
                self.$list.append(item);
            });
        }
    };
    slider.initialize();

    var vplayer = {
        initialize: function() {
            var self = this;

            explorer.on('open', function() {
                slider.open('Browse Music');
            });

            explorer.on('changedirectory', function(files) {
                slider.list(files, templates.file_explorer);
            });
        }
    };
    vplayer.initialize();


    $(document).on('click', function(e) {
        explorer.open();
    });
});