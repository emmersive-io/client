var moment = require('moment');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabActivity.html');
var itemTemplate = require('../templates/activityItem.html');
var defaultUserImage = require('../images/profile-red.png');

function ProjectActivity(project) {
    this.element = renderTemplate(template);
    var listElement = this.element.querySelector('ul');
    this.getTasks(project).forEach(function (item) {
        listElement.appendChild(item.element);
    });
}

ProjectActivity.prototype.getTasks = function (project) {
    var items = [];
    for (var id in project.activities) {
        var item = project.activities[id];
        var user = project.people[item.created_by] || {};

        items.push({
            date: item.created_at,
            element: renderTemplate(itemTemplate, {
                name: user.name,
                description: item.description,
                date: moment(item.created_at).fromNow(),
                image: item.userImage || defaultUserImage,
                userProfilePage: user.name && '#profile/' + item.created_by
            }, {
                name: '.user-name',
                date: '.item__date',
                image: '.profile-image',
                description: '.item__description',
                userProfilePage: {target: '.user-name', prop: 'href'}
            })
        });
    }

    return items.sort(function (item1, item2) {
        return item2.date - item1.date;
    });
};

module.exports = ProjectActivity;