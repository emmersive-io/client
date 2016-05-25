import {slide} from '../core/animate';
import Basement from './basement';
import Header from './header';
import Router from '../core/router';
import session from '../firebase/session';


export default class Site {
    constructor(HomePage, routes) {
        this.router = new Router(HomePage, routes, this.onRouteChanged.bind(this));
    }

    onClick(e) {
        if (!e.target.closest('.page--basement')) {
            document.body.classList.remove('show-basement');
        }
    }

    onRouteChanged(Page, options) {
        session.onUser(function (user) {
            var isLoggedIn = (user != null);
            var isLoginScreen = location.hash.indexOf('#login') === 0;

            if (isLoggedIn === isLoginScreen) {
                this.router.navigateTo(isLoggedIn ? '#' : '#login', {replace: true});
                return;
            }

            if (!this.element) {
                this.render();
            }

            this.updateBasement(user);

            var page = this.page;
            if (options.isNewPage) {
                page = new Page({header: this.header, router: this.router});
            }

            var onRoute = page.onRoute && page.onRoute.apply(page, options.path);
            if (page !== this.page) {
                this.page = page;
                Promise.resolve(onRoute).then(function () {
                    this.showPage(page, options);
                }.bind(this));
            }
        }.bind(this))
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'page page--main';
        this.element.innerHTML = '<div class="content content--main"></div>';
        this.container = this.element.firstElementChild;

        this.header = new Header(this.router);
        this.element.insertBefore(this.header.element, this.element.firstElementChild);
        document.body.appendChild(this.element);
        document.body.addEventListener('click', this.onClick.bind(this), false);
    }

    showPage(page, options) {
        if (page === this.page) {
            this.container.appendChild(page.element);
            if (this.lastPage) {
                var callback = this.lastPage.onRemove && this.lastPage.onRemove.bind(this.lastPage);
                slide(this.page.element, this.lastPage.element, options.isMovingForward, callback);
            }

            this.lastPage = this.page;
        }
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