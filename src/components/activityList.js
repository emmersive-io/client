var moment = require('moment');
var projectRef = require('../firebase/projects');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/activityList.html');
var itemTemplate = require('../templates/activityItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ActivityList(projectId) {
    this.element = renderTemplate(template);
    projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.project.id = projectId;

        this.activityList = this.element.querySelector('ul');
        this.newActivity = this.element.querySelector('.activity--new');
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        for (var i = 0; i < project.activities.length; i++) {
            this.activityList.insertAdjacentHTML('beforebegin', this.getActivityHTML(project.activities[i]));
        }
    }.bind(this));
}

ActivityList.prototype.getActivityHTML = function (item) {
    var user = this.project.people[item.created_by] || {};
    item.date = moment(item.created_at).fromNow();
    item.user = user;

    if (!user.image) {
        user.image = defaultUserImage;
    }

    return itemTemplate(item);
};

ActivityList.prototype.onNewActivity = function (e) {
    e.preventDefault();

    var content = this.newActivity.elements[0].value.trim();
    this.newActivity.reset();

    if (content) {
        projectRef.createActivity(this.project.id, content).then(function (task) {
            this.activityList.insertAdjacentHTML('beforeend', this.getActivityHTML(task));
        }.bind(this));
    }
};

module.exports = ActivityList;