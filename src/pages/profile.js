var auth = require('../firebase/auth');
var userRef = require('../firebase/user');

var animate = require('../core/animate');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/profile.html');

function ProfilePage(header) {
    header.update();
    this.element = renderTemplate(template);
}

ProfilePage.prototype.onRoute = function (root, userId) {
    this.userId = userId;
    var currentUser = auth.get();
    var formElements = this.element.elements;

    if (currentUser && currentUser.id === userId) {
        this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }
    else {
        formElements.name.readOnly = true;
        formElements.email.readOnly = true;
        this.element.classList.add('profile--current');
    }

    userRef.get(userId).then(function (user) {
        this.user = user;
        formElements.name.value = user.name;
        formElements.email.value = user.email;
    }.bind(this));
};

ProfilePage.prototype.onFormSubmit = function (e) {
    e.preventDefault();

    var elements = e.target.elements;
    var name = elements.name.value.trim();
    var email = elements.name.value.trim();

    if (name && email) {
        this.user.name = name;
        this.user.email = email;
        //userRef.update(this.userId, this.user);
    }
    else {
        animate(e.target, 'anim--shake');
    }
};

module.exports = ProfilePage;