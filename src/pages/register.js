var auth = require('../firebase/auth');
var animate = require('../core/animate');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/register.html');

function RegisterPage(header) {
    header.update();
    this.element = renderTemplate(template);
    this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
}

RegisterPage.prototype.onFormSubmit = function (e) {
    e.preventDefault();

    var elements = e.target.elements;

    var name = elements.name.value.trim();
    var email = elements.email.value.trim();
    var password = elements.password.value.trim();
    var password2 = elements.password2.value.trim();

    if (name && email && password && password === password2) {
        auth.createUser(name, email, password).then(function () {
            location.assign('#');
        }, function () {
            animate(e.target, 'anim--shake');
        });
    }
    else {
        animate(e.target, 'anim--shake');
    }
};

module.exports = RegisterPage;