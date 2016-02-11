var auth = require('../firebase/auth');
var animate = require('../core/animate');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/login.html');

function LoginPage(header) {
    header.update({showBackButton: false});

    this.element = renderTemplate(template);
    this.element.firstElementChild.addEventListener('submit', this.onFormSubmit.bind(this), false);
}

LoginPage.prototype.onFormSubmit = function (e) {
    e.preventDefault();

    var elements = e.target.elements;
    var email = elements.email.value.trim();
    var password = elements.password.value.trim();

    if (email && password) {
        auth.login(email, password).then(function () {
            location.assign('#');
        }, function () {
            animate(e.target, 'anim--shake');
        });
    }
};

module.exports = LoginPage;