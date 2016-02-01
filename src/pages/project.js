var projectRef = require('../firebase/projects');


function ProjectPage(header) {
    this.header = header;
    this.element = document.createElement('div');
    this.element.className = 'project-page';
    this.element.style.height = '800px';
}

ProjectPage.prototype.onProjectDataReceived = function (project) {
    this.project = project;
    var rootPath = '#projects/' + this.projectId;

    this.header.update({
        title: project.name,
        description: project.description,
        tabs: [
            {title: 'Activity', href: rootPath + '/activity'},
            {title: 'Tasks', href: rootPath + '/tasks'},
            {title: 'People', href: rootPath + '/people'}
        ]
    });
};

ProjectPage.prototype.onRoute = function (root, projectId, tab) {
    if (/^activity$|^people$|^tasks$/.test(tab)) {
        if (this.project && this.projectId === projectId) {
            this.setTabContent(tab);
        }
        else {
            this.projectId = projectId;
            projectRef.getById(projectId, this.onProjectDataReceived.bind(this));
        }
    }
    else {
        // Default to the activity screen
        location.replace('#projects/' + projectId + '/activity');
    }
};

ProjectPage.prototype.setTabContent = function (tab) {

};

module.exports = ProjectPage;