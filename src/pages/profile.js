var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/profile.html');


function ProfilePage(header) {
    header.update({title: 'Profile', leftAction: 'back'});
    this.element = renderTemplate(template);
    this.element.addEventListener('click', this.onClick.bind(this), false);
}

ProfilePage.prototype.onClick = function (e) {
    var button = e.target.closest('button');
    if (button && button.classList.contains('button--log-out')) {
        connection.logOut();
        location.assign('#login');
    }
};

ProfilePage.prototype.onRoute = function (root, userId) {
    this.userId = userId;
    var currentUser = connection.getAuth();

    if (currentUser && currentUser.uid === userId) {
        this.element.classList.add('profile--current');
    }
    else {
        var inputs = this.element.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].readOnly = true;
        }
    }

    connection.getUser(userId).then(function (user) {
        this.element.querySelector('[name="name"]').value = user.name;
        this.element.querySelector('[name="email"]').value = user.email;
    }.bind(this));
};

module.exports = ProfilePage;