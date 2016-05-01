import onReady from './onReady';


export default class Router {
    constructor(defaultRoute, routes, onRouteChanged) {
        this.history = [];
        this.historyIndex = -1;

        this.routeMap = {};
        this.onRouteChanged = onRouteChanged;
        this.defaultRoute = {handler: defaultRoute};

        this.addRoutes(routes);
        window.addEventListener('click', this.onClick.bind(this), false);
        window.addEventListener('hashchange', this.onHashChanged.bind(this));
        onReady(this.onHashChanged.bind(this));
    }

    addRoutePart(obj, path, handler, depth = 0) {
        var routeObj;
        var pathPart = path.shift();

        if (pathPart[0] === ':') {
            routeObj = this.getObject(obj, 'default');
        }
        else {
            routeObj = this.getObject(this.getObject(obj, 'named'), pathPart);
        }

        if (path.length) {
            this.addRoutePart(this.getObject(routeObj, 'subRoutes'), path, handler, depth + 1);
        }
        else {
            routeObj.depth = depth;
            routeObj.handler = handler;
        }
    }

    addRoutes(routes) {
        for (var route in routes) {
            this.addRoutePart(this.routeMap, route.split('/'), routes[route]);
        }
    }

    getObject(obj, property) {
        if (!obj[property]) {
            obj[property] = {};
        }

        return obj[property];
    }

    getRouteObj(obj, options) {
        var pathPart = options.path[options.index];
        var routeObj = pathPart && ((obj.named && obj.named[pathPart]) || obj.default);
        if (routeObj) {
            if (routeObj === obj.default) {
                options.index++;
            }
            else {
                options.path.splice(options.index, 1);
            }

            var subRouteObj = this.getRouteObj(routeObj.subRoutes, options);
            if (subRouteObj && subRouteObj.handler) {
                return subRouteObj;
            }

            return routeObj.handler && routeObj;
        }
    }

    handleHashChange() {
        var hash = location.hash;
        var path = hash.substring(1).split('/');
        var options = {index: 0, path: path.slice()};

        var historyIndex;
        var routeObj = this.getRouteObj(this.routeMap, options) || this.defaultRoute;
        options.isNewPage = this.isNewPage(routeObj, path);

        if (this.internalRoute) {
            historyIndex = this.internalRoute.historyIndex;
            options.isMovingForward = this.internalRoute.isMovingForward;
            this.internalRoute = null;
        }
        else {
            var index;
            if (history.length === this.historyLength) { // TODO: Does this hold up when moving forward from history[-1]?
                index = this.history.findIndex(entry => entry.hash === hash);
            }

            if (index === 0 || index > 0) {
                historyIndex = index;
                options.isMovingForward = index >= this.historyIndex;
            }
            else {
                options.isMovingForward = true;
            }
        }

        var state = {hash: hash, routeObj: routeObj, path: path, pathParts: options.path};
        if (historyIndex != null) {
            this.historyIndex = historyIndex;
            this.history[this.historyIndex] = state;
        }
        else {
            this.historyIndex++;
            this.history.length = this.historyIndex;
            this.history.push(state);
        }

        this.historyLength = history.length;
        this.onRouteChanged(routeObj.handler, options);
    }

    isNewPage(routeObj, path) {
        var state = this.history[this.historyIndex];
        if (state && state.routeObj === routeObj) {
            var index = routeObj.depth;
            return state.path[index] !== path[index];
        }

        return true;
    }

    onClick(e) {
        var href;
        if (e.target.tagName === 'A') {
            if (e.target.hasAttribute('target')) {
                return;
            }

            href = e.target.getAttribute('href');
            e.preventDefault();
        }
        else {
            var element = e.target.closest('[data-href]');
            href = element && element.dataset.href;
        }

        if (href) {
            this.navigateTo(href);
        }
    }

    onHashChanged() {
        // Delay to avoid iOS bug where the location isn't updated in time
        setTimeout(this.handleHashChange.bind(this), 0);
    }

    navigateBack() {
        this.internalRoute = {historyIndex: this.historyIndex, isMovingForward: false};
        if (this.historyIndex > 0) {
            this.internalRoute.historyIndex--;
            history.go(-1);
        }
        else {
            this.internalRoute.historyIndex++;
            var state = this.history[this.historyIndex];
            location.assign('#' + state.path.slice(0, -1));
        }
    }

    navigateTo(hash, options = {}) {
        if (hash) {
            this.internalRoute = {historyIndex: this.historyIndex};
            var index = this.history.findIndex(entry => entry.hash === hash);
            var indexDelta = index - this.historyIndex;

            if (index >= 0 && Math.abs(indexDelta) < 3) {
                if (indexDelta) {
                    this.internalRoute.historyIndex += indexDelta;
                    this.internalRoute.isMovingForward = indexDelta > 0;
                    history.go(indexDelta);
                }
            }
            else {
                this.internalRoute.isMovingForward = true;
                if (options.replace) {
                    location.replace(hash);
                }
                else {
                    this.internalRoute.historyIndex++;
                    location.assign(hash);
                }
            }
        }
    }
}