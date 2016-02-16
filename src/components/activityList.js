var moment = require('moment');
var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/activityList.html');
var itemTemplate = require('../templates/activityItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ActivityList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);

    connection.getProjectActivity(projectId).then(function (activities) {
        this.activityList = this.element.querySelector('ul');
        this.newActivity = this.element.querySelector('.activity--new');
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        for (var i = 0; i < activities.length; i++) {
            this.activityList.insertAdjacentHTML('beforeend', this.getActivityHTML(activities[i]));
        }
    }.bind(this));
}

ActivityList.prototype.getActivityHTML = function (item) {
    item.date = moment(item.created_at).fromNow();
    if (!item.created_by.image) {
        item.created_by.image = defaultUserImage;
    }

    return itemTemplate(item);
};

ActivityList.prototype.onNewActivity = function (e) {
    e.preventDefault();

    var content = this.newActivity.elements[0].value.trim();
    if (content) {
        this.newActivity.reset();
        connection.createActivity(this.projectId, content).then(function (task) {
            this.activityList.insertAdjacentHTML('beforeend', this.getActivityHTML(task));
            this.activityList.lastElementChild.scrollIntoView(false);
        }.bind(this));
    }
};

module.exports = ActivityList;