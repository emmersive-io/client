var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectEdit.handlebars');


function ProjectEditPage(header) {
    this.header = header;
}

ProjectEditPage.prototype.onBlur = function (e) {
    var field;
    if (e.target.classList.contains('project__name')) {
        field = 'name';
    }
    else if (e.target.classList.contains('project__description')) {
        field = 'description';
    }

    if (field) {
        var projectData = {};
        projectData[field] = e.target.value.trim();
        connection.updateProject(this.project.id, projectData);
    }
};

ProjectEditPage.prototype.onClick = function (e) {
    var button = e.target.closest('button');
    if (button && confirm('Are you sure you want to delete the project?')) {
        connection.removeProject(this.project.id).then(function () {
            location.assign('#projects')
        });
    }
};

ProjectEditPage.prototype.onRoute = function (root, projectId) {
    return connection.getProject(projectId).then(function (project) {
        this.project = project;
        this.header.update({leftAction: 'back'});
        this.element = renderTemplate(template({
            action: 'Delete Project',
            project: project
        }));

        this.element.addEventListener('blur', this.onBlur.bind(this), true);
        this.element.addEventListener('click', this.onClick.bind(this), false);
    }.bind(this));
};

module.exports = ProjectEditPage;