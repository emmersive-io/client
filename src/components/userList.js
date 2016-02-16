var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/userList.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function UserList() {}

UserList.prototype.render = function (projectId) {
    return connection.getProjectPeople(projectId).then(function (users) {
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (!user.image) {
                user.image = defaultUserImage;
            }
        }

        this.element = renderTemplate(template(users));
    }.bind(this));
};

module.exports = UserList;