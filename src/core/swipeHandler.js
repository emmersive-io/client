function SwipeHandler(element, selector, callback) {
    this.element = element;
    this.selector = selector;
    this.callback = callback;
    this.movements = [];

    this.element.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.element.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    this.element.addEventListener('touchend', this.onTouchEnd.bind(this), false);
    this.element.addEventListener('touchcancel', this.onTouchCancel.bind(this), false);
}

SwipeHandler.prototype = {
    getTouch: function (e) {
        if (this.initialTouch) {
            var touches = e.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];
                if (touch.identifier === this.initialTouch.identifier) {
                    return touch;
                }
            }
        }
    },

    onSwipeEnd: function () {
        this.initialTouch = null;
        this.movements.length = 0;
    },

    onTouchStart: function (e) {
        var touches = e.touches;
        if (touches && touches.length === 1) {
            var touch = touches[0];
            var element = touch.target.closest(this.selector);
            if (element) {
                element.classList.add('swiping');
                this.initialTouch = {
                    identifier: touch.identifier,
                    timeStamp: e.timeStamp,
                    pageX: touch.pageX,
                    pageY: touch.pageY,
                    element: element
                };
            }
        }
    },

    onTouchMove: function (e) {
        var touch = this.getTouch(e);
        if (touch) {
            var xDist = Math.min(0, touch.pageX - this.initialTouch.pageX);
            this.initialTouch.element.style.left = xDist + 'px';

            this.movements.push({
                timeStamp: e.timeStamp,
                pageX: touch.pageX,
                pageY: touch.pageY
            });
        }
    },

    onTouchEnd: function (e) {
        var touch = this.getTouch(e);
        if (touch) {
            var element = this.initialTouch.element;
            element.classList.remove('swiping');

            this.movements = this.movements.filter(function (movement) {
                return e.timeStamp - movement.timeStamp < 150;
            });

            var movement = this.movements.shift();
            if (movement && movement.pageX - touch.pageX > 100) {
                // Webkit prefix necessary for iOS 8 and non-Chromium Native Android browser (4.x)
                var eventName = (element.style.transition === undefined) ? 'webkitTransitionEnd' : 'transitionend';
                element.addEventListener(eventName, function onTransitionEnd(e) {
                    element.removeEventListener(eventName, onTransitionEnd, false);
                    this.callback(element);
                }.bind(this), false);

                element.style.left = '-100%';
            }
            else {
                element.style.left = '0px';
            }


            this.onSwipeEnd();
        }
    },

    onTouchCancel: function (e) {
        if (this.getTouch(e)) {
            this.onSwipeEnd();
        }
    }
};

module.exports = SwipeHandler;