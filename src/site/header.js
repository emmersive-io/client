var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/header.html');

function Header() {
    this.element = renderTemplate(template);
    this.element.addEventListener('click', this.onTabClicked.bind(this), false);

    var headers = this.element.getElementsByClassName('header__title');
    this.bannerTitle = headers[0];
    this.headerTitle = headers[1];

    this.headerDescription = this.element.querySelector('.header__description');
    this.headerTabs = this.element.querySelector('.header__tabs');

    this.backButton = this.element.querySelector('.header__back');
    this.backButton.addEventListener('click', function () {history.back();}, false);

    this.handleScroll();
}

Header.prototype.handleScroll = function () {
    this.banner = this.element.querySelector('.header__banner');
    this.bannerOverlay = this.element.querySelector('.header__banner-overlay');
    this.bannerContainer = this.element.querySelector('.header__banner-container');
    window.addEventListener('scroll', this.onScroll.bind(this));
};

Header.prototype.onScroll = function () {
    // Fade/blur the banner area
    var bannerScrollMax = 160;
    var scrollTop = document.body.scrollTop;
    var bannerScroll = Math.min(scrollTop, bannerScrollMax);
    var bannerProgress = 1 - ((bannerScrollMax - bannerScroll) / bannerScrollMax);

    if (bannerProgress !== this.bannerProgress) {
        var overlayOpacity = bannerProgress * 0.8;
        var blurFilter = 'blur(' + (bannerProgress * 8) + 'px)';
        var boxBlur = 8 * bannerProgress;
        var boxSpread = 2 * bannerProgress;
        this.bannerProgress = bannerProgress;

        this.bannerOverlay.style.opacity = overlayOpacity;
        this.bannerContainer.style.boxShadow = '0px 0px ' + boxBlur + 'px ' + boxSpread + 'px #000';
        this.banner.style.webkitFilter = blurFilter;
        this.banner.style.filter = blurFilter;
    }

    // Scroll movable content
    var heightOffset, minHeaderHeight;
    var maxHeaderHeight = 140;

    if (this.title) {
        var titlePosition = maxHeaderHeight - scrollTop + 8;
        this.bannerTitle.style.top = Math.min(maxHeaderHeight, Math.max(0, titlePosition)) + 'px';
    }

    if (this.tabs) {
        if (!this.tabOffset) {
            this.tabOffset = this.headerTabs.offsetTop;
        }

        minHeaderHeight = 92;
        heightOffset = this.tabOffset - 92;
        this.element.classList.toggle('header--fixed-tabs', this.tabOffset - scrollTop <= 44);
    }
    else {
        heightOffset = 58;
        minHeaderHeight = 44;
    }

    var bannerHeight = maxHeaderHeight - (scrollTop - heightOffset);
    this.bannerContainer.style.height = Math.max(minHeaderHeight, Math.min(maxHeaderHeight, bannerHeight)) + 'px';
};

Header.prototype.onTabClicked = function (e) {
    var tabElement = e.target.closest('.header__tab');
    if (tabElement && !tabElement.classList.contains('selected')) {
        var href = tabElement && tabElement.getAttribute('data-href');
        this.headerTabs.querySelector('.selected').classList.remove('selected');
        tabElement.classList.add('selected');
        location.replace(href);
    }
};

Header.prototype.setDescription = function (description) {
    this.headerDescription.hidden = (description == null);
    if (description) {
        this.headerDescription.textContent = description;
    }
};

Header.prototype.setTabs = function (tabs) {
    this.tabs = tabs;
    this.headerTabs.hidden = (tabs == null);

    if (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var tabElement = this.headerTabs.children[i];

            tabElement.setAttribute('data-href', tab.href);
            tabElement.firstElementChild.textContent = tab.title;
            tabElement.classList.toggle('selected', (tab.href === location.hash));
        }
    }
};

Header.prototype.setTitle = function (title) {
    this.title = title;
    this.bannerTitle.hidden = (title == null);
    this.headerTitle.hidden = (title == null);

    if (title) {
        this.bannerTitle.textContent = title;
        this.headerTitle.textContent = title;
    }
};

Header.prototype.update = function (options) {
    options = options || {};

    this.setTabs(options.tabs);
    this.setTitle(options.title);
    this.setDescription(options.description);

    this.backButton.style.display = (options.showBackButton === false) ? 'none' : '';
    this.tabOffset = null;
    this.onScroll();
};

module.exports = Header;