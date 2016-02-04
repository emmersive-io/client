var moment = require('moment');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabTasks.html');
var itemTemplate = require('../templates/taskItem.html');
var defaultUserImage = require('../images/profile-red.png');

function ProjectTask(project) {
    this.element = renderTemplate(template);
    var listElement = this.element.querySelector('ul');
    this.getTasks(project).forEach(function (task) {
        listElement.appendChild(task.element);
    });
}

ProjectTask.prototype.getTasks = function (project) {
    var items = [];
    for (var id in project.tasks) {
        var task = project.tasks[id];
        var user = project.people[task.created_by] || {};

        items.push({
            date: task.created_at,
            element: renderTemplate(itemTemplate, {
                date: 'did something ' + moment(task.created_at).fromNow(),
                description: task.description,
                image: task.userImage || defaultUserImage,
                isComplete: task.status === 'open' ? null : true,
                userName: user.name,
                userProfilePage: user.name && '#profile/' + task.created_by
            }, {
                date: '.item__date',
                description: '.item__description',
                image: '.profile-image--small',
                isComplete: {target: '.task__checkbox', prop: 'checked'},
                userName: '.user-name',
                userProfilePage: {target: '.user-name', prop: 'href'}
            })
        });
    }

    return items.sort(function (item1, item2) {
        return item2.date - item1.date;
    });
};

module.exports = ProjectTask;