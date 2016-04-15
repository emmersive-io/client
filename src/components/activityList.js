var firebase = require('../firebase/firebase').get();
var connection = require('../firebase/connection');
var transform = require('../firebase/transform');
var session = require('../firebase/session');

var moment = require('moment');
var insertSorted = require('../core/insertSorted');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/activityList.html');
var itemTemplate = require('../templates/activityItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ActivityList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);
    this.activityList = this.element.querySelector('ul');
    this.newActivity = this.element.querySelector('.activity--new');
    this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);
    this.items = [];

    this.activityRef = firebase.child('activities/' + projectId);
    this.activityRef.on('child_added', this.onActivityAdded, this);
}

ActivityList.prototype.isAtBottom = function () {
    if (!this.scrollable) {
        this.scrollable = this.element.closest('.scrollable');
    }

    var scrollBottom = this.scrollable.clientHeight + this.scrollable.scrollTop;
    return (this.scrollable.scrollHeight - scrollBottom) <= 0;
};

ActivityList.prototype.onActivityAdded = function (snapshot) {
    var activity = transform.toObj(snapshot);
    activity.date = moment(activity.created_at).fromNow();

    connection.getUser(activity.created_by).then(function (user) {
        activity.created_by = user;
        if (user && !user.image) {
            user.image = defaultUserImage;
        }

        var index = insertSorted(this.items, activity, function (activity1, activity2) {
            return activity1.created_at > activity2.created_at;
        });

        var wasAtBottom = this.isAtBottom();
        var sibling = this.items[index - 1];
        if (sibling) {
            sibling.element.insertAdjacentHTML('afterend', itemTemplate(activity));
            activity.element = sibling.element.nextElementSibling;
        }
        else {
            this.activityList.insertAdjacentHTML('afterbegin', itemTemplate(activity));
            activity.element = this.activityList.firstElementChild;
        }

        if (wasAtBottom && !this.isAtBottom()) {
            this.scrollable.scrollTop = this.scrollable.scrollHeight;
        }
    }.bind(this));
};

ActivityList.prototype.onNewActivity = function (e) {
    e.preventDefault();

    var content = this.newActivity.elements[0].value.trim();
    if (content) {
        connection.createActivity(this.projectId, content);
        this.newActivity.reset();
    }
};

ActivityList.prototype.remove = function () {
    this.activityRef.off('child_added', this.onProjectJoin, this);
};

module.exports = ActivityList;