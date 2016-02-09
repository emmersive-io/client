var projectRef = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabPeople.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ProjectPeople(header) {
    this.header = header;
}

ProjectPeople.prototype.onRoute = function (root, projectId) {
    return projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.header.update({title: project.name});

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

module.exports = ProjectPeople;