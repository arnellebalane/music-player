(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'extend'], func);
    } else {
        root.visualizer = func(root.jQuery, root.extend);
    }
})(this, function($, extend) {
    var default_config = {
        slices_count: 200,
        data_size: 1024,
        no_signal: 128
    };

    function Visualizer(element, config) {
        config = extend(default_config, config);
        var steps = ~~(config.data_size / config.slices_count);
        var width = element.width();
        var height = element.height();
        var slice_width = width / config.slices_count;
        var slices = [];
        var data = [];

        var container = $('<section class="visualization-container"></section>');
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
        element.replaceWith(container);


        function render() {
            requestAnimationFrame(render);

            for (var i = 0, j = 0; i < config.slices_count; i++, j += steps) {
                var slice = slices[i];
                var strip = slice.strip;
                var offset = slice.offset;
                var value = 1;
                if (data[j] !== undefined) {
                    var value = Math.abs(data[j]) / config.no_signal;
                }

                strip.css(
                    'transform', 
                    'translateX(' + offset + 'px) scaleY(' + value + ')'
                );
            }
        }
        render();


        this.visualize = function(_data) {
            data = _data;
        }
    }

    return Visualizer;
});