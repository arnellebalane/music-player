(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'stapes', 'mustache'], func);
    } else {
        root.Slider = func(root.jQuery, root.Stapes, root.Mustache);
    }
})(this, function($, Stapes, Mustache) {
    var Slider = Stapes.subclass({
        constructor: function(element, title, contents) {
            this.element = element;
            this.title = title;
            this.contents = contents;
            var self = this;

            this.element.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if ($(e.target).hasClass('close-button')) {
                    self.element.removeClass('slider-menu--opened');
                }
            });
        },

        open: function(mode, title) {
            this.title.text(title);
            this.element.data('mode', mode);
            this.element.addClass('slider-menu--opened');
        },

        list: function(items, format) {
            var self = this;
            this.contents.empty();
            items.forEach(function(item) {
                item = Mustache.render(format, item);
                self.contents.append(item);
            });
        }
    });

    return Slider;
});