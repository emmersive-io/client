var mapToElement = require('./mapToElement');

module.exports = function (template, obj, map) {
    var div = document.createElement('div');
    div.innerHTML = template;

    var element = div.firstElementChild;
    if (obj && map) {
        mapToElement(div.firstElementChild, obj, map);
    }

    return element;
};