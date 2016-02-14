var projectRef = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/userList.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function UserList() {}

UserList.prototype.render = function (projectId) {
    return projectRef.get(projectId).then(function (project) {
        this.project = project;
        for (var userId in project.people) {
            var user = project.people[userId] || {};
            user.id = userId;

            if (!user.image) {
                user.image = defaultUserImage;
            }
        }

        this.element = renderTemplate(template(project));
    }.bind(this));
};

module.exports = UserList;