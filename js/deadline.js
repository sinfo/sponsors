(function () {
    'use strict';

    var config = window.SINFO_CONFIG || {};
    var deadline = typeof config.materialsDeadline === 'string'
        ? config.materialsDeadline.trim()
        : '';

    document.getElementById('materials-deadline').textContent = deadline || 'To be announced';
})();
