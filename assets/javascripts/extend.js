(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define([], func);
    } else {
        root.extend = func();
    }
})(this, function() {
    function extend(base, extension) {
        if (extension && typeof extension === 'object') {
            var result = {};
            Object.keys(base).forEach(function(key) {
                result[key] = base[key];
            });
            Object.keys(extension).forEach(function(key) {
                result[key] = extension[key];
            });
            return result;
        }
        return base;
    }

    return extend;
});