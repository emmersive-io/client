function SwipeHandler(element, selector) {
    this.element = element;
    this.selector = selector;
    this.movements = [];

    this.element.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    this.element.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    this.element.addEventListener('touchend', this.onTouchEnd.bind(this), false);
}

SwipeHandler.prototype = {
    closeItem: function () {
        if (this.initialTouch) {
            this.initialTouch.element.classList.remove('open');
            this.initialTouch.element.style.left = '0px';
            this.initialTouch = null;
            this.movements.length = 0;
        }
    },

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

    onTouchStart: function (e) {
        var touches = e.touches;
        if (touches && touches.length === 1) {
            var touch = touches[0];
            var element = touch.target.closest(this.selector);
            if (element) {
                this.closeItem();
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
            var lastTouch = this.movements[this.movements.length - 1] || this.initialTouch;
            var xDelta = Math.abs(touch.pageX - lastTouch.pageX);
            var yDelta = Math.abs(touch.pageY - lastTouch.pageY);

            if (xDelta > yDelta * 2) {
                var xDist = Math.min(0, touch.pageX - this.initialTouch.pageX);
                this.initialTouch.element.style.left = xDist + 'px';

                this.movements.push({
                    timeStamp: e.timeStamp,
                    pageX: touch.pageX,
                    pageY: touch.pageY
                });
            }
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
                element.classList.add('open');
            }
            else {
                this.closeItem();
            }
        }
    }
};

module.exports = SwipeHandler;