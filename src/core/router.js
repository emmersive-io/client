'use strict';

var onReady = require('./onReady');

function getObject(obj, property) {
    if (!obj[property]) {
        obj[property] = {};
    }

    return obj[property];
}


function Router(routeMap, onRouteChanged) {
    this.routeMap = {};
    this.onRouteChanged = onRouteChanged;

    this.defaultRoute = routeMap[''];
    delete routeMap[''];

    for (var route in routeMap) {
        this.addRoutePart(this.routeMap, route.split('/'), routeMap[route]);
    }

    window.addEventListener('hashchange', this.onHashChanged.bind(this));
    onReady(this.onHashChanged.bind(this));
}

Router.prototype.addRoutePart = function (obj, path, handler) {
    var routeObj;
    var pathPart = path.shift();

    if (pathPart[0] === ':') {
        routeObj = getObject(obj, 'default');
    }
    else {
        var namedRoutes = getObject(obj, 'named');
        routeObj = getObject(namedRoutes, pathPart);
    }

    if (path.length) {
        this.addRoutePart(getObject(routeObj, 'subRoutes'), path, handler);
    }
    else {
        routeObj.handler = handler;
    }
};

Router.prototype.getRouteHandler = function (obj, path) {
    var pathPart = path.shift();
    var routeObj = pathPart && ((obj.named && obj.named[pathPart]) || obj.default);
    if (routeObj) {
        var subRouteHandler;
        if (routeObj.subRoutes && path.length) {
            subRouteHandler = this.getRouteHandler(routeObj.subRoutes, path);
        }

        return subRouteHandler || routeObj.handler;
    }
};

Router.prototype.onHashChanged = function () {
    var path = location.hash.substring(1).split('/');
    var handler = this.getRouteHandler(this.routeMap, path.slice()) || this.defaultRoute;
    this.onRouteChanged(handler, path);
};

module.exports = Router;