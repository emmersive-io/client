function sizeToContent(element) {
    element.style.height = '';
    var clientHeight = element.clientHeight;
    var scrollHeight = element.scrollHeight;

    if (clientHeight < scrollHeight) {
        element.style.height = ((element.offsetHeight - clientHeight) + scrollHeight) + 'px';
    }
}

function sizeAllToContent(element) {
    var textareas = element.getElementsByTagName('textarea');
    for (var i = 0; i < textareas.length; i++) {
        sizeToContent(textareas[i]);
    }
}

document.addEventListener('input', function (e) {
    if (e.target.tagName === 'TEXTAREA') {
        sizeToContent(e.target);
    }
}, false);

export {sizeToContent, sizeAllToContent};