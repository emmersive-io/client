document.addEventListener('click', function (e) {
    var element = e.target.closest('[data-href]');
    var href = element && element.getAttribute('data-href');
    if (href) {
        location.assign(href);
    }
}, false);