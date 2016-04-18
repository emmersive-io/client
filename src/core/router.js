import onReady from './onReady';

export default class Router {
    constructor(routeMap, onRouteChanged) {
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

    addRoutePart(obj, path, handler) {
        var routeObj;
        var pathPart = path.shift();

        if (pathPart[0] === ':') {
            routeObj = this.getObject(obj, 'default');
        }
        else {
            var namedRoutes = this.getObject(obj, 'named');
            routeObj = this.getObject(namedRoutes, pathPart);
        }

        if (path.length) {
            this.addRoutePart(this.getObject(routeObj, 'subRoutes'), path, handler);
        }
        else {
            routeObj.handler = handler;
        }
    }

    getObject(obj, property) {
        if (!obj[property]) {
            obj[property] = {};
        }

        return obj[property];
    }

    getRouteHandler(obj, path) {
        var pathPart = path.shift();
        var routeObj = pathPart && ((obj.named && obj.named[pathPart]) || obj.default);
        if (routeObj) {
            var subRouteHandler;
            if (routeObj.subRoutes && path.length) {
                subRouteHandler = this.getRouteHandler(routeObj.subRoutes, path);
            }

            return subRouteHandler || routeObj.handler;
        }
    }

    onHashChanged() {
        setTimeout(function () {
            var pathString = location.hash.substring(1);
            var path = pathString ? pathString.split('/') : [];

            var handler = this.getRouteHandler(this.routeMap, path.slice()) || this.defaultRoute;
            this.onRouteChanged(handler, path);
        }.bind(this), 0);
    }
}