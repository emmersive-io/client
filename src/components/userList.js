var firebase = require('../firebase/firebase').get();
var connection = require('../firebase/connection');
var transform = require('../firebase/transform');
var session = require('../firebase/session');

var moment = require('moment');
var insertSorted = require('../core/insertSorted');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/userList.html');
var itemTemplate = require('../templates/userItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function UserList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);
    this.userList = this.element.querySelector('ul');
    this.users = [];

    this.userRef = firebase.child('projects/' + projectId + '/people');
    this.userRef.on('child_added', this.onProjectAdded, this);
    this.userRef.on('child_removed', this.onProjectRemoved, this);
}

UserList.prototype.onProjectAdded = function (snapshot) {
    var userId = snapshot.key();
    connection.getUser(userId).then(function (user) {
        if (!user.image) {
            user.image = defaultUserImage;
        }

        var index = insertSorted(this.users, user, function (user1, user2) {
            return user1.name.localeCompare(user2.name) > 0;
        });

        var sibling = this.users[index - 1];
        if (sibling) {
            sibling.element.insertAdjacentHTML('afterend', itemTemplate(user));
            user.element = sibling.element.nextElementSibling;
        }
        else {
            this.userList.insertAdjacentHTML('afterbegin', itemTemplate(user));
            user.element = this.userList.firstElementChild;
        }
    }.bind(this));
};

UserList.prototype.onProjectRemoved = function (snapshot) {
    var userId = snapshot.key();
    var index = this.users.findIndex(function (user) {
        return user.id === userId;
    });

    if (index >= 0) {
        this.users.splice(index, 1)[0].element.remove();
    }
};

UserList.prototype.remove = function () {
    this.userRef.off('child_added', this.onProjectAdded, this);
    this.userRef.off('child_removed', this.onProjectRemoved, this);
};

module.exports = UserList;