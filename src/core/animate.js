module.exports = function (element, className, callback) {
    if (element.classList.contains(className)) {
        return;
    }

    element.addEventListener('animationend', function onAnimationEnd(e) {
        e.target.classList.remove(className);
        e.target.removeEventListener('animationend', onAnimationEnd, false);

        if (callback) {
            callback(e.target);
        }
    }, false);

    element.classList.add(className);
};