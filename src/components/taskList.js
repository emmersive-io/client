var moment = require('moment');
var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/taskList.html');
var itemTemplate = require('../templates/taskItem.handlebars');
var sizeTextarea = require('../core/sizeTextarea');


function TaskList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);
    this.element.addEventListener('blur', this.onFocusChanged.bind(this), true);
    this.element.addEventListener('focus', this.onFocusChanged.bind(this), true);

    connection.getProjectTasks(projectId).then(function (tasks) {
        this.taskList = this.element.querySelector('ul');
        this.newTask = this.element.querySelector('.task--new');
        this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);

        for (var i = 0; i < tasks.length; i++) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(tasks[i]));
        }

        sizeTextarea(this.taskList);
    }.bind(this));
}

TaskList.prototype.getTaskHTML = function (task) {
    task.dateDescription = 'created ' + moment(task.created_at).fromNow();
    task.isComplete = (task.status !== 'open');
    return itemTemplate(task);
};

TaskList.prototype.onFocusChanged = function (e) {
    if (e.target.tagName === 'TEXTAREA') {
        var taskElement = e.target.closest('.checkbox-card');
        if (taskElement) {
            taskElement.classList.toggle('focused', e.target === document.activeElement);
            sizeTextarea(e.target);
        }
    }
};

TaskList.prototype.onNewTask = function (e) {
    e.preventDefault();

    var content = this.newTask.elements[0].value.trim();
    if (content) {
        this.newTask.reset();
        connection.createTask(this.projectId, content).then(function (task) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(task));
        }.bind(this));
    }
};

module.exports = TaskList;