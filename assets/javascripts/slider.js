(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'stapes', 'mustache'], func);
    } else {
        root.Slider = func(root.jQuery, root.Stapes, root.Mustache);
    }
})(this, function($, Stapes, Mustache) {
    var Slider = Stapes.subclass({
        constructor: function(element) {
            this.$element = element;
            this.$title = element.find('.slider-menu__maintitle');
            this.$subtitle = element.find('.slider-menu__subtitle');
            this.$actions = element.find('.slider-menu__actions');
            this.$customactions = element.find('.custom-actions');
            this.$contents = element.find('.menu-list');
            var self = this;

            this.$element.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });

            this.$actions.on('click', '[data-action]', function() {
                self.emit('actionbutton', $(this).data('action'));
            });

            this.$contents.on('dblclick', '.menu-list__item', function() {
                self.emit('doubleclick', $(this));
            });
        },

        open: function() {
            this.$element.addClass('slider-menu--opened');
            return this;
        },

        close: function() {
            this.$element.removeClass('slider-menu--opened');
            return this;
        },

        list: function(items, format) {
            var self = this;
            this.$contents.empty().scrollTop(0);
            items.forEach(function(item) {
                item = Mustache.render(format, item);
                self.$contents.append(item);
            });
            return this;
        },

        title: function(title) {
            this.$title.text(title);
            return this;
        },

        subtitle: function(subtitle) {
            this.$subtitle.text(subtitle);
            if (subtitle.length) {
                this.$contents.addClass('menu-list--lower');
            } else {
                this.$contents.removeClass('menu-list--lower');
            }
            return this;
        },

        actions: function(actions) {
            this.$customactions.html(actions);
            return this;
        }
    });

    return Slider;
});