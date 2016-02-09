var moment = require('moment');
var projectRef = require('../firebase/projects');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabActivity.html');
var itemTemplate = require('../templates/activityItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ProjectActivity(header) {
    this.header = header;
}

ProjectActivity.prototype.getActivityHTML = function (item) {
    var user = this.project.people[item.created_by] || {};
    item.date = moment(item.created_at).fromNow();
    item.user = user;

    if (!user.image) {
        user.image = defaultUserImage;
    }

    return itemTemplate(item);
};

ProjectActivity.prototype.onNewActivity = function (e) {
    e.preventDefault();

    var content = this.newActivity.elements[0].value.trim();
    this.newActivity.reset();

    if (content) {
        projectRef.createActivity(this.project.id, content).then(function (task) {
            this.activityList.insertAdjacentHTML('beforeend', this.getActivityHTML(task));
        }.bind(this));
    }
};

ProjectActivity.prototype.onRoute = function (root, projectId) {
    return projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.project.id = projectId;
        this.header.update({title: project.name});

        this.element = renderTemplate(template);
        this.activityList = this.element.querySelector('ul');
        this.newActivity = this.element.querySelector('.activity--new');
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        for (var id in project.activities) {
            this.activityList.insertAdjacentHTML('beforebegin', this.getActivityHTML(project.activities[id]));
        }
    }.bind(this));
};

module.exports = ProjectActivity;