import animate from '../core/animate';
import Basement from './basement';
import Header from './header';
import Router from '../core/router';
import session from '../firebase/session';


export default class Site {
    constructor(routeMap) {
        this.router = new Router(routeMap, this.onRouteChanged.bind(this));
    }

    getDirection(path, oldPath) {
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
    }

    onClick(e) {
        if (!e.target.closest('.page--basement')) {
            document.body.classList.remove('show-basement');
        }
    }

    onRouteChanged(Page, path) {
        session.onUser(function (user) {
            var isLoggedIn = (user != null);
            var isLoginScreen = location.hash.indexOf('#login') === 0;

            if (isLoggedIn === isLoginScreen) {
                location.assign(isLoggedIn ? '#' : '#login');
                return;
            }

            if (!this.element) {
                this.render();
            }

            this.updateBasement(user);

            var page = this.page;
            if (!page || !(page instanceof Page) || (page.is && !page.is.apply(page, path))) {
                page = new Page(this.header);
            }

            var onRoute = page.onRoute && page.onRoute.apply(page, path);
            if (page !== this.page) {
                this.page = page;
                Promise.resolve(onRoute).then(function () {
                    this.showPage(path, page);
                }.bind(this));
            }
        }.bind(this))
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'page page--main';
        this.element.innerHTML = '<div class="content content--main"></div>';
        this.container = this.element.firstElementChild;

        this.header = new Header();
        this.element.insertBefore(this.header.element, this.element.firstElementChild);
        document.body.appendChild(this.element);
        document.body.addEventListener('click', this.onClick.bind(this), false);
    }

    showPage(path, page) {
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
    }

    updateBasement(user) {
        if (this.basement) {
            if (!user) {
                this.basement.remove();
                this.basement = null;
            }
        }
        else if (user) {
            this.basement = new Basement(user);
            document.body.appendChild(this.basement.element);
        }
    }
}