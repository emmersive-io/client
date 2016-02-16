var connection = require('../firebase/connection');
var animate = require('../core/animate');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/resetPassword.html');
var passwordResetTemplate = require('../templates/passwordResetMessage.html');


function ResetPasswordPage(header) {
    header.update({leftAction: 'back', style: 'transparent-dark'});
    this.element = renderTemplate(template);
    this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
}

ResetPasswordPage.prototype.onFormSubmit = function (e) {
    e.preventDefault();

    var email = e.target.elements.email.value.trim();
    if (email) {
        connection.resetPassword(email);
        e.target.innerHTML = passwordResetTemplate;
    }
    else {
        animate(e.target, 'anim--shake');
    }
};

module.exports = ResetPasswordPage;