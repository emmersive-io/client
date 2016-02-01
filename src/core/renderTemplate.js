var contentProp = {
    'IMG': 'src',
    'INPUT': 'value',
    'SELECT': 'value',
    'TEXTAREA': 'value'
};

function getElement(template) {
    var div = document.createElement('div');
    div.innerHTML = template;
    return div.firstElementChild;
}

module.exports = function (template, obj, map) {
    var element = getElement(template);

    for (var key in map) {
        var propMap = map[key];
        var value = obj[key];

        if (propMap.hide) {
            if (value) {
                var targets = Array.isArray(propMap.hide) ? propMap.hide : [propMap.hide];
                for (var i = 0; i < targets.length; i++) {
                    element.querySelector(targets[i]).style.display = 'none';
                }
            }
        }
        else {
            var target = element;
            if (propMap.target || typeof propMap === 'string') {
                target = target.querySelector(propMap.target || propMap);
            }

            if (propMap.hideIfNull && !value && value !== 0) {
                target.style.display = 'none';
            }
            else if (propMap.prop) {
                target.setAttribute(propMap.prop, value);
            }
            else {
                target[contentProp[target.tagName] || 'textContent'] = value;
            }
        }
    }

    return element;
};