var moment = require('moment');
var projectRef = require('../firebase/projects');

var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabTasks.html');
var itemTemplate = require('../templates/taskItem.handlebars');
var defaultUserImage = require('../images/profile-red.png');


function ProjectTask(header) {
    this.header = header;
}

ProjectTask.prototype.getTaskHTML = function (task) {
    task.user = this.project.people[task.created_by];
    task.dateDescription = 'created ' + moment(task.created_at).fromNow();
    task.isComplete = (task.status !== 'open');

    if (!task.user.image) {
        task.user.image = defaultUserImage
    }

    return itemTemplate(task);
};

ProjectTask.prototype.onNewTask = function (e) {
    e.preventDefault();

    var content = this.newTask.elements[0].value.trim();
    this.newTask.reset();

    if (content) {
        projectRef.createTask(this.project.id, content).then(function (task) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(task));
        }.bind(this));
    }
};

ProjectTask.prototype.onRoute = function (root, projectId) {
    return projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.project.id = projectId;

        this.header.update({
            title: project.name,
            action: {
                icon: 'fa fa-plus',
                onClick: function () {
                    this.newTask.firstElementChild.focus();
                }.bind(this)
            }
        });

        this.element = renderTemplate(template);
        this.taskList = this.element.querySelector('ul');
        this.newTask = this.element.querySelector('.task--new');
        this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);

        for (var id in project.tasks) {
            this.taskList.insertAdjacentHTML('beforeend', this.getTaskHTML(project.tasks[id]));
        }
    }.bind(this));
};

module.exports = ProjectTask;