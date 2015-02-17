(function(root, func) {
    if (typeof define === 'function' && define.amd) {
        requirejs(['scripts/player', 'scripts/visualizer'], func);
    } else {
        func(root.player, root.visualizer);
    }
})(this, function(player, visualizer) {
    
});