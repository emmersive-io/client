function animate(element, className, callback) {
    if (element.classList.contains(className)) {
        return;
    }

    // Webkit prefix necessary for iOS 8 and non-Chromium Native Android browser (4.x)
    var eventName = (element.style.animation === undefined) ? 'webkitAnimationEnd' : 'animationend';
    element.addEventListener(eventName, function onAnimationEnd(e) {
        e.target.classList.remove(className);
        e.target.removeEventListener(eventName, onAnimationEnd, false);

        if (callback) {
            callback(e.target);
        }
    }, false);

    element.classList.add(className);
}

function slide(newElement, oldElement, isMovingForward, callback) {
    var direction = isMovingForward ? 'left' : 'right';
    animate(newElement, 'anim--in-' + direction);
    animate(oldElement, 'anim--out-' + direction, function (element) {
        element.remove();
        callback && callback();
    });
}

export {animate, slide};