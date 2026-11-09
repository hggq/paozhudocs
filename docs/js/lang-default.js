/* Default-language handling for standalone EN/ZH document pairs.
   Usage: <script src="./js/lang-default.js"
                  data-zh="page.html" data-en="page_en.html"
                  data-page="zh|en"></script>
   English is the default. A manual language choice is remembered, and legacy
   in-page language links are upgraded with ?lang= so they still work. */
(function () {
    'use strict';

    var script = document.currentScript;
    if (!script) return;

    var zhPage = script.getAttribute('data-zh') || '';
    var enPage = script.getAttribute('data-en') || '';
    var isEnglishPage = script.getAttribute('data-page') === 'en';

    var forced = null;
    var preferred = null;
    try {
        forced = new URLSearchParams(window.location.search).get('lang');
        if (forced !== 'zh' && forced !== 'en') forced = null;
        preferred = window.localStorage.getItem('paozhu-lang');
    } catch (e) { /* storage may be unavailable under file:// */ }

    if (forced) {
        try { window.localStorage.setItem('paozhu-lang', forced); } catch (e) {}
        preferred = forced;
    }

    document.addEventListener('DOMContentLoaded', function () {
        var links = document.querySelectorAll('a[href]');
        Array.prototype.forEach.call(links, function (a) {
            var raw = a.getAttribute('href') || '';
            var parts = /^([^?#]+)(\?[^#]*)?(#.*)?$/.exec(raw);
            if (!parts) return;

            var file = parts[1].split('/').pop();
            var lang = file === zhPage ? 'zh' : (file === enPage ? 'en' : null);
            if (!lang || /[?&]lang=/.test(parts[2] || '')) return;

            var query = parts[2] ? parts[2] + '&' : '?';
            a.setAttribute('href', parts[1] + query + 'lang=' + lang + (parts[3] || ''));
        });
    });

    if (!isEnglishPage && enPage && forced !== 'zh' && preferred !== 'zh') {
        var target = enPage + (forced === 'en' ? '?lang=en' : '') + (window.location.hash || '');
        window.location.replace(target);
    }
}());
