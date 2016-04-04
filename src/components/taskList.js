var connection = require('../firebase/connection');
var session = require('../firebase/session');

var moment = require('moment');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/taskList.html');
var itemTemplate = require('../templates/taskItem.handlebars');
var sizeTextarea = require('../core/sizeTextarea');


function TaskList(projectId) {
    this.projectId = projectId;
    this.element = renderTemplate(template);
    this.element.addEventListener('change', this.onStatusChanged.bind(this), true);

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
    var dateDescription;
    if (task.updated_at) {
        dateDescription = 'updated ' + moment(task.updated_at).fromNow();
    }
    else {
        dateDescription = 'created ' + moment(task.created_at).fromNow();
    }

    task.isComplete = (task.status !== 'open');
    return itemTemplate({
        user: task.updated_by || task.created_by,
        dateDescription: dateDescription,
        task: task
    });
};

TaskList.prototype.onStatusChanged = function (e) {
    var taskElement = e.target.closest('.checkbox-card');
    if (taskElement) {
        var data = {};
        var userId = session.user.id;

        if (e.target.tagName === 'INPUT') {
            data.status = e.target.checked ? 'closed' : 'open';
            data.updated_status = userId;
        }
        else {
            data.description = e.target.value;
            data.updated_by = userId;
        }

        connection.updateTask(this.projectId, taskElement.dataset.id, data);
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