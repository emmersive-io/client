var firebase = require('../firebase/firebase').get();
var connection = require('../firebase/connection');
var transform = require('../firebase/transform');
var session = require('../firebase/session');

var moment = require('moment');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/userList.html');
var itemTemplate = require('../templates/userItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function UserList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);
    this.userList = this.element.querySelector('ul');

    this.userRef = firebase.child('projects/' + projectId + '/people');
    this.userRef.on('child_added', this.onProjectAdded, this);
    this.userRef.on('child_removed', this.onProjectRemoved, this);
}

UserList.prototype.onProjectAdded = function (snapshot) {
    var userId = snapshot.key();
    connection.getUser(userId).then(function (user) {
        var user = users[i];
        if (!user.image) {
            user.image = defaultUserImage;
        }

        this.userList.insertAdjacentHTML('beforeend', itemTemplate(user));
    });
};

UserList.prototype.onProjectRemoved = function (snapshot) {
    var userId = snapshot.key();
    var link = this.element.querySelector('[href="#profile"' + userId + '"]');
    if (link) {
        link.parentElement.remove();
    }
};

UserList.prototype.remove = function () {
    this.userRef.off('child_added', this.onProjectAdded, this);
    this.userRef.off('child_removed', this.onProjectRemoved, this);
};

module.exports = UserList;