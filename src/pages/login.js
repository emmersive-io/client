var auth = require('../firebase/auth');
var animate = require('../core/animate');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/login.html');

function LoginPage(header) {
    header.update();

    this.element = renderTemplate(template);
    this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
}

LoginPage.prototype.onFormSubmit = function (e) {
    e.preventDefault();

    var elements = e.target.elements;
    var email = elements.email.value.trim();
    var password = elements.password.value.trim();

    auth.login(email, password, function (error) {
        if (error) {
            animate(e.target, 'anim--shake');
        }
        else {
            location.assign('');
        }
    });
};

module.exports = LoginPage;