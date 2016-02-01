'use strict';

require('../core/platform');
var Header = require('./header');
var Router = require('../core/router');

function Site(routeMap) {
    this.router = new Router(routeMap, this.onRouteChanged.bind(this));
}

Site.prototype.createHeader = function () {
    this.header = new Header();
    document.body.appendChild(this.header.element);
};

Site.prototype.onRouteChanged = function (Page, path) {
    if (!this.header) {
        this.createHeader();
    }

    if (!(this.page instanceof Page)) {
        if (this.page) {
            this.page.element.remove();
        }

        this.page = new Page({
            update: this.header.update.bind(this.header)
        });

        document.body.appendChild(this.page.element);
    }

    if (this.page.onRoute) {
        this.page.onRoute.apply(this.page, path);
    }
};

module.exports = Site;