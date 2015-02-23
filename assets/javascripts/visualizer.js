(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'stapes', 'extend'], func);
    } else {
        root.visualizer = func(root.jQuery, root.Stapes, root.extend);
    }
})(this, function($, Stapes, extend) {
    var default_config = {
        slices_count: 200,
        data_size: 1024,
        no_signal: 128
    };


    var Visualizer = Stapes.subclass({
        constructor: function(element, config) {
            config = extend(default_config, config);
            var visualization = element.find('.visualization-container');
            var steps = ~~(config.data_size / config.slices_count);
            var width = visualization.width();
            var height = visualization.height();
            var slice_width = width / config.slices_count;
            var slices = [];

            this.data = [];
            var self = this;

            var container = $('<div class="visualization-container"></div>');
            for (var i = 0; i < config.slices_count; i++) {
                var offset = i * slice_width;

                var strip = $('<div class="visualization-strip"></div>');
                strip.width(slice_width);
                strip.height(height);
                strip.css('transform', 'translateX(' + offset + 'px)');

                var clone = $('<div class="visualization-element"></div>');
                clone.css('transform', 'translateX(' + -offset + 'px)');

                strip.append(clone);
                container.append(strip);

                slices.push({ strip: strip, offset: offset });
            }
            visualization.replaceWith(container);


            element.on('click', '.player-control', function(e) {
                e.stopPropagation();
                self.emit('playercontrol', $(this).data('action'));
            });


            function render() {
                requestAnimationFrame(render);

                for (var i = 0, j = 0; i < config.slices_count; i++, j += steps) {
                    var slice = slices[i];
                    var strip = slice.strip;
                    var offset = slice.offset;
                    var value = 1;
                    if (self.data[j] !== undefined) {
                        var value = Math.abs(self.data[j]) / config.no_signal;
                    }

                    strip.css(
                        'transform', 
                        'translateX(' + offset + 'px) scaleY(' + value + ')'
                    );
                }
            }
            render();
        },

        visualize: function(data) {
            this.data = data;
        }
    });


    return Visualizer;
});