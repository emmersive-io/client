'use strict';

var connection = require('../firebase/connection');
var animate = require('../core/animate');
var Header = require('./header');
var Router = require('../core/router');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/site.html');


function Site(routeMap) {
    new Router(routeMap, this.onRouteChanged.bind(this));
}

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

Site.prototype.onRouteChanged = function (Page, path) {
    var isLoggedIn = connection.isLoggedIn();
    var isLoginScreen = location.hash.indexOf('#login') === 0;
    if (isLoggedIn === isLoginScreen) {
        location.assign(isLoggedIn ? '#' : '#login');
        return;
    }

    if (!this.element) {
        this.render();
    }

    var page = this.page;
    if (!(page instanceof Page)) {
        page = new Page(this.header);
    }

    var onRoute = page.onRoute && page.onRoute.apply(page, path);
    if (page !== this.page) {
        this.page = page;
        if (onRoute && onRoute.then) {
            onRoute.then(this.showPage.bind(this, path, page));
        }
        else {
            this.showPage(path, page);
        }
    }
};

Site.prototype.render = function () {
    this.element = renderTemplate(template);
    this.header = new Header();
    this.element.insertBefore(this.header.element, this.element.firstElementChild);
    this.container = this.element.querySelector('.content');
    document.body.appendChild(this.element);
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

        var lastPage = this.lastPage;
        animate(this.page.element, pageAnim);
        animate(this.lastPage.element, lastPageAnim, function (element) {
            element.remove();
            if (lastPage.onRemove) {
                lastPage.onRemove();
            }
        });
    }

    this.lastPage = this.page;
    this.path = path;
};

module.exports = Site;