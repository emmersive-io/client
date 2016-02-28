function sizeToContent(element) {
    element.style.height = '';
    var clientHeight = element.clientHeight;
    var scrollHeight = element.scrollHeight;

    if (clientHeight < scrollHeight) {
        element.style.height = ((element.offsetHeight - clientHeight) + scrollHeight) + 'px';
    }
}

document.addEventListener('input', function (e) {
    if (e.target.tagName === 'TEXTAREA') {
        sizeToContent(e.target);
    }
}, false);

module.exports = function (element) {
    if (element.tagName === 'TEXTAREA') {
        sizeToContent(element);
    }
    else {
        var textareas = element.getElementsByTagName('textarea');
        for (var i = 0; i < textareas.length; i++) {
            sizeToContent(textareas[i]);
        }
    }
};