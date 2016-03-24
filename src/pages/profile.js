var connection = require('../firebase/connection');
var session = require('../firebase/session');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/profile.handlebars');
var defaultUserImage = require('../images/profile.png');


function ProfilePage(header) {
    this.header = header;
}

ProfilePage.prototype.onClick = function (e) {
    var button = e.target.closest('button');
    if (button && button.classList.contains('button--log-out')) {
        session.logOut();
    }
};

ProfilePage.prototype.onRoute = function (root, userId) {
    this.isCurrentUser = (session.user.id === userId);
    if (this.isCurrentUser) {
        this.render(session.user);
    }
    else {
        return connection.getUser(userId).then(this.render.bind(this));
    }
};

ProfilePage.prototype.render = function (user) {
    this.header.update({
        title: 'Profile',
        leftAction: 'back'
    });

    if (!user.image) {
        user.image = defaultUserImage;
    }

    this.element = renderTemplate(template({
        isCurrentUser: this.isCurrentUser,
        user: user
    }));

    if (this.isCurrentUser) {
        this.element.addEventListener('click', this.onClick.bind(this), false);
    }
    else {
        var inputs = this.element.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].readOnly = true;
        }
    }
};

module.exports = ProfilePage;