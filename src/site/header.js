import headerLogo from '../images/header-logo.png';

export default class Header {
    constructor() {
        this.element = document.createElement('header');
        this.element.className = 'header header--main';
        this.element.innerHTML = `
            <button class="header__button--back">
                <span class="fa fa-chevron-left" aria-hidden="true"></span>
            </button>
            <button class="header__button--basement">
                <span class="fa fa-bars" aria-hidden="true"></span>
                <img class="header__logo" src="${headerLogo}"/>
            </button>
            <h1 class="header__title text-truncate"></h1>
            <button class="header__button--action"></button>`;

        this.headerTitle = this.element.children[2];
        this.rightButton = this.element.lastElementChild;
        this.element.addEventListener('click', this.onClick.bind(this), false);
    }

    onClick(e) {
        var button = e.target.closest('button');
        if (button) {
            if (button === this.rightButton) {
                if (typeof this.options.onAction === 'function') {
                    this.options.onAction();
                }
                else {
                    location.assign(this.options.onAction);
                }
            }
            else if (button.classList.contains('header__button--basement')) {
                document.body.classList.toggle('show-basement');
                e.stopPropagation();
            }
            else {
                history.back();
            }
        }
    }

    update(options) {
        this.options = options || {};

        document.body.classList.remove('show-basement');
        this.headerTitle.textContent = this.options.title || '';
        this.rightButton.textContent = this.options.action || '';
        this.element.setAttribute('data-left-action', this.options.leftAction || '');

        if (this.options.style) {
            this.element.setAttribute('data-style', this.options.style);
        }
        else {
            this.element.removeAttribute('data-style');
        }
    }
}