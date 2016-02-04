'use strict';

var animate = require('../core/animate');
var Header = require('./header');
var Router = require('../core/router');

function Site(routeMap) {
    this.router = new Router(routeMap, this.onRouteChanged.bind(this));
}

Site.prototype.createHeader = function () {
    this.header = new Header();
    this.container = document.createElement('div');
    this.container.className = 'container';

    document.body.appendChild(this.header.element);
    document.body.appendChild(this.container);
};

Site.prototype.getDirection = function () {
    if (this.lastPath) {
        var length = this.path.length;
        var oldLength = this.lastPath.length;
        var minLength = Math.min(length, oldLength);

        for (var i = 0; i < minLength; i++) {
            if (this.path[i] !== this.lastPath[i]) {
                return true;
            }
        }

        return length > oldLength;
    }
};

Site.prototype.onRouteChanged = function (Page, path) {
    this.lastPath = this.path;
    this.path = path;

    if (!this.header) {
        this.createHeader();
    }

    if (!(this.page instanceof Page)) {
        var page = new Page({
            update: this.header.update.bind(this.header)
        });

        this.container.appendChild(page.element);

        if (this.page) {
            var animateForward = this.getDirection();
            var pageAnim = animateForward ? 'anim--in-left' : 'anim--in-right';
            var lastPageAnim = animateForward ? 'anim--out-left' : 'anim--out-right';

            animate(page.element, pageAnim);
            animate(this.page.element, lastPageAnim, function (element) {
                element.remove();
            });
        }

        this.page = page;
    }

    if (this.page.onRoute) {
        this.page.onRoute.apply(this.page, path);
    }
};

module.exports = Site;