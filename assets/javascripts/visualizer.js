(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], func);
    } else {
        root.visualizer = func(root.jQuery);
    }
})(this, function($) {
    return {};
});