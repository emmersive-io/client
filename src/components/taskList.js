var connection = require('../firebase/connection');
var session = require('../firebase/session');
var transform = require('../firebase/transform');

var moment = require('moment');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/taskList.html');
var itemTemplate = require('../templates/taskItem.handlebars');
var sizeTextarea = require('../core/sizeTextarea');


function TaskList(projectId) {
    this.projectId = projectId;
    this.tasks = [];

    this.element = renderTemplate(template);
    this.taskList = this.element.querySelector('ul');
    this.newTask = this.element.querySelector('.task--new');
    this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);
    this.element.addEventListener('change', this.onStatusChanged.bind(this), true);

    this.taskRef = connection.firebase.child('tasks/' + projectId);
    this.taskRef.on('child_added', this.onTaskAdded, this);
    this.taskRef.on('child_changed', this.onTaskChanged, this);
    this.taskRef.on('child_removed', this.onTaskRemoved, this);
}

TaskList.prototype.onNewTask = function (e) {
    e.preventDefault();

    var content = this.newTask.elements[0].value.trim();
    if (content) {
        connection.createTask(this.projectId, content);
        this.newTask.reset();
    }
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

TaskList.prototype.onTaskAdded = function (snapshot) {
    var task = transform.toObj(snapshot);
    task.isComplete = (task.status !== 'open');

    this.taskList.insertAdjacentHTML('beforeend', itemTemplate(task));
    task.element = this.taskList.lastElementChild;
    this.tasks.push(task);

    sizeTextarea(task.element);
    this.updateLastAction(task);
};

TaskList.prototype.onTaskChanged = function (snapshot) {
    var taskId = snapshot.key();
    var index = this.tasks.findIndex(function (task) {
        return task.id === taskId;
    });

    var task = this.tasks[index];
    Object.assign(task, snapshot.val());

    var contentElement = task.element.querySelector('.task__content');
    contentElement.firstElementChild.checked = (task.status !== 'open');
    contentElement.lastElementChild.textContent = task.description;

    sizeTextarea(task.element);
    this.updateLastAction(task);
};

TaskList.prototype.onTaskRemoved = function (snapshot) {
    var taskId = snapshot.key();
    var index = this.tasks.findIndex(function (task) {
        return task.id === taskId;
    });

    if (index >= 0) {
        this.tasks.splice(index, 1)[0].element.remove();
    }
};

TaskList.prototype.remove = function () {
    this.taskRef.off('child_added', this.onTaskAdded, this);
    this.taskRef.off('child_changed', this.onTaskChanged, this);
    this.taskRef.off('child_removed', this.onTaskRemoved, this);
};

TaskList.prototype.updateLastAction = function (task) {
    var actionDate = task.updated_at || task.created_at;
    if (task.actionDate !== actionDate) {
        task.actionDate = actionDate;

        connection.getUser(task.updated_by || task.created_by).then(function (user) {
            var header = task.element.querySelector('.task__header');

            if (user) {
                header.firstElementChild.href = '#profile/' + user.id;
                header.firstElementChild.textContent = user.name;
            }

            if (task.updated_at > task.created_at) {
                header.lastElementChild.textContent = 'updated ' + moment(task.updated_at).fromNow();
            }
            else {
                header.lastElementChild.textContent = 'created ' + moment(task.created_at).fromNow();
            }
        });
    }
};

module.exports = TaskList;