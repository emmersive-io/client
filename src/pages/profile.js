var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/profile.handlebars');
var defaultUserImage = require('../images/profile.png');

function ProfilePage(header) {
    this.header = header;
}

ProfilePage.prototype.onClick = function (e) {
    var button = e.target.closest('button');
    if (button && button.classList.contains('button--log-out')) {
        connection.logOut();
    }
};

ProfilePage.prototype.onRoute = function (root, userId) {
    return connection.getUser(userId).then(function (user) {
        this.header.update({
            title: 'Profile',
            leftAction: 'back'
        });

        if (!user.image) {
            user.image = defaultUserImage;
        }

        var isCurrentUser = connection.getAuth().uid === userId;
        this.element = renderTemplate(template({
            isCurrentUser: isCurrentUser,
            user: user
        }));

        if (isCurrentUser) {
            this.element.addEventListener('click', this.onClick.bind(this), false);
        }
        else {
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = true;
            }
        }
    }.bind(this));
};

module.exports = ProfilePage;