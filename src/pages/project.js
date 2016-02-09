var moment = require('moment');
var projectRef = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/project.handlebars');

var defaultProjectImage = require('../images/default.png');
var defaultUserImage = require('../images/profile-red.png');


function ProjectPage(header) {
    this.header = header;
}

ProjectPage.prototype.onBlur = function (e) {
    var field;
    if (e.target.classList.contains('project__name')) {
        field = 'name';
    }
    else if (e.target.classList.contains('project__description')) {
        field = 'description';
    }

    if (field) {
        var projectData = {};
        projectData[field] = e.target.value;
        projectRef.update(this.project.id, projectData);
    }
};

ProjectPage.prototype.onRoute = function (root, projectId) {
    return projectRef.get(projectId).then(function (project) {
        this.project = project;
        this.header.update();

        project.id = projectId;
        project.userCount = Object.keys(project.people).length;
        project.image = project.image || defaultProjectImage;

        var user;
        for (var userId in project.people) {
            user = project.people[userId] || {};
            if (!user.image) {
                user.image = defaultUserImage;
            }
        }

        var activityIds = project.activities && Object.keys(project.activities);
        if (activityIds && activityIds.length) {
            var lastActivity = project.activities[activityIds.pop()];
            project.activityUser = project.people[lastActivity.created_by];
            project.activityLabel = 'Active ' + moment(lastActivity.created_at).fromNow();
            project.activityDescription = lastActivity.description;
        }
        else {
            project.activityLabel = 'No Activity';
            project.activityDescription = 'Start a conversation!';
        }

        var openTasks = 0;
        var completedTasks = 0;
        for (var taskId in project.tasks) {
            if (project.tasks[taskId].status === 'open') {
                openTasks++;
            }
            else {
                completedTasks++;
            }
        }

        if (openTasks || completedTasks) {
            project.taskLabel = openTasks ? openTasks + ' open tasks' : 'All tasks complete';
            project.taskDescription = completedTasks ? completedTasks + ' completed tasks' : 'No tasks have been completed';

        }
        else {
            project.taskLabel = 'No Tasks';
            project.taskDescription = 'Write some and get to work!';
        }

        this.element = renderTemplate(template(project));
        this.element.addEventListener('blur', this.onBlur.bind(this), true);
    }.bind(this));
};

module.exports = ProjectPage;