var moment = require('moment');
var projectRef = require('../firebase/projects');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/taskList.html');
var itemTemplate = require('../templates/taskItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function TaskList(projectId) {
    this.element = renderTemplate(template);

    projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.project.id = projectId;

        this.taskList = this.element.querySelector('ul');
        this.newTask = this.element.querySelector('.task--new');
        this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);

        for (var i = 0; i < project.tasks.length; i++) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(project.tasks[i]));
        }
    }.bind(this));
}

TaskList.prototype.getTaskHTML = function (task) {
    task.user = this.project.people[task.created_by] || {};
    task.dateDescription = 'created ' + moment(task.created_at).fromNow();
    task.isComplete = (task.status !== 'open');

    if (!task.user.image) {
        task.user.image = defaultUserImage
    }

    return itemTemplate(task);
};

TaskList.prototype.onNewTask = function (e) {
    e.preventDefault();

    var content = this.newTask.elements[0].value.trim();
    this.newTask.reset();

    if (content) {
        projectRef.createTask(this.project.id, content).then(function (task) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(task));
        }.bind(this));
    }
};

module.exports = TaskList;