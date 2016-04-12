var firebase = require('../firebase/firebase').get();
var connection = require('../firebase/connection');
var transform = require('../firebase/transform');
var session = require('../firebase/session');

var moment = require('moment');
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

    this.activityRef = firebase.child('activities/' + projectId);
    this.activityRef.on('child_added', this.onActivityAdded, this);
}

ActivityList.prototype.onActivityAdded = function (snapshot) {
    var activity = transform.toObj(snapshot);
    activity.date = moment(activity.created_at).fromNow();

    // TODO: Make sure order is kept
    connection.getUser(activity.created_by).then(function (user) {
        if (user && !user.image) {
            user.image = defaultUserImage;
        }

        activity.created_by = user;
        this.activityList.insertAdjacentHTML('beforeend', itemTemplate(activity));
    }.bind(this));

    // TODO: Scroll to the bottom, unless the user has scrolled up
    //    var scrollable = this.element.closest('.scrollable');
    //    scrollable.scrollTop = scrollable.scrollHeight;
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