(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'mustache', 'extend'], func);
    } else {
        root.Notifier = func(root.jQuery, root.Mustache, root.extend);
    }
})(this, function($, Mustache, extend) {
    var default_config = {
        display_time: 3000
    };

    function Notifier(template, config) {
        config = extend(default_config, config);
        var notification = null;
        var s, t;
        var self = this;

        this.notify = function(message) {
            if (notification) {
                clearTimeout(s);
                clearTimeout(t);
                self.close(notification);
            }
            notification = $(Mustache.render(template, { message: message }));
            $(document.body).append(notification);

            notification.removeClass('notification--hidden');
            s = setTimeout(function() {
                self.close(notification);
                notification = null;
            }, config.display_time);

            return notification;
        };

        this.close = function(notification) {
            notification.addClass('notification--hidden');
            t = setTimeout(function() {
                notification.remove();
            }, 300);
        };
    }

    return Notifier;
});