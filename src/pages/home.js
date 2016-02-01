var auth = require('../firebase/auth');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/home.html');

function HomePage(header) {
    header.update({showBackButton: false});

    var isLoggedIn = auth.isLoggedIn();
    this.element = renderTemplate(template, {
        isLoggedIn: isLoggedIn,
        showLoginMessage: !isLoggedIn
    }, this.templateMap);
}


HomePage.prototype = {
    templateMap: {
        isLoggedIn: {hide: '.message--login'},
        showLoginMessage: {hide: ['.button--create-project', '.message--no-projects']}
    }
};

module.exports = HomePage;