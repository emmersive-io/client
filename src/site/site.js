'use strict';

var auth = require('../firebase/auth');
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

Site.prototype.getDirection = function (path, oldPath) {
    if (oldPath) {
        var length = path.length;
        var oldLength = oldPath.length;
        var minLength = Math.min(length, oldLength);

        for (var i = 0; i < minLength; i++) {
            if (path[i] !== oldPath[i]) {
                return true;
            }
        }

        return length > oldLength;
    }
};

Site.prototype.showPage = function (path, page) {
    if (page !== this.page) {
        return;
    }

    this.container.appendChild(page.element);
    if (this.lastPage) {
        var animateForward = this.getDirection(path, this.path);
        var pageAnim = animateForward ? 'anim--in-left' : 'anim--in-right';
        var lastPageAnim = animateForward ? 'anim--out-left' : 'anim--out-right';

        animate(this.page.element, pageAnim);
        animate(this.lastPage.element, lastPageAnim, function (element) {
            element.remove();
        });
    }

    this.lastPath = this.path;
    this.lastPage = this.page;
    this.path = path;
};

Site.prototype.onRouteChanged = function (Page, path) {
    if (location.hash.indexOf('#login') !== 0 && !auth.isLoggedIn()) {
        location.assign('#login');
        return;
    }

    if (!this.header) {
        this.createHeader();
    }

    var page = this.page;
    if (!(this.page instanceof Page)) {
        page = new Page({
            update: this.header.update.bind(this.header)
        });
    }

    var promise = page.onRoute && page.onRoute.apply(page, path);
    if (page !== this.page) {
        this.page = page;
        if (promise && promise.then) {
            promise.then(this.showPage.bind(this, path, page));
        }
        else {
            this.showPage(path, page);
        }
    }
};

module.exports = Site;