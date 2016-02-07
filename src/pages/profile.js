var auth = require('../firebase/auth');
var userRef = require('../firebase/user');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/profile.html');


function ProfilePage(header) {
    header.update();

    this.element = renderTemplate(template);
    this.element.addEventListener('click', this.onClick.bind(this), false);
}

ProfilePage.prototype.onClick = function (e) {
    var button = e.target.closest('button');
    if (button.classList.contains('button--log-out')) {
        auth.logOut();
        location.assign('#');
    }
};

ProfilePage.prototype.onRoute = function (root, userId) {
    this.userId = userId;
    var currentUser = auth.get();

    if (currentUser && currentUser.uid === userId) {
        this.element.classList.add('profile--current');

    }
    else {
        var inputs = this.element.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].readOnly = true;
        }
    }

    userRef.get(userId).then(function (user) {
        this.element.querySelector('[name="name"]').value = user.name;
        this.element.querySelector('[name="email"]').value = user.email;
    }.bind(this));
};

module.exports = ProfilePage;