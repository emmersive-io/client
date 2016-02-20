var Basement = require('./basement');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/header.html');


function Header() {
    this.element = renderTemplate(template);
    this.element.addEventListener('click', this.onClick.bind(this), false);

    this.basement = new Basement();
    this.headerTitle = this.element.querySelector('.header__title');
    this.rightButton = this.element.querySelector('.header__button--action');
    document.body.appendChild(this.basement.element);
}

Header.prototype.onClick = function (e) {
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
            if (document.body.classList.contains('show-basement')) {
                this.basement.render();
            }
        }
        else {
            history.back();
        }
    }
};

Header.prototype.update = function (options) {
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
};

module.exports = Header;