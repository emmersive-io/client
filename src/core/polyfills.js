'use strict';

if (!Element.prototype.closest) { // Needed for IE/Edge/Safari < 9
    Element.prototype.closest = function (selector) {
        var element = this;
        while (element) {
            if (element.matches(selector)) {
                return element;
            }

            element = element.parentElement;
        }
    };
}

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector;
}

if (!Element.prototype.remove) { // Needed for IE
    Element.prototype.remove = function () {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

if (!Object.assign) { // Needed for IE/Safari < 9
    Object.assign = function (target) {
        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }

        return output;
    };
}

// IE 10/11 don't support classlist.toggle's second param
var test = document.createElement('div');
test.classList.toggle('test', false);

if (test.classList.contains('test')) {
    Element.prototype.classList.toggle = function (name, isTrue) {
        if (isTrue === undefined) {
            this.classList.toggle(name);
        }
        else if (isTrue) {
            this.classList.add(name);
        }
        else {
            this.classList.remove(name);
        }
    }
}