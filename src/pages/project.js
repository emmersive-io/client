var projectRef = require('../firebase/projects');
var ActivityTab = require('../components/projectActivity');
var PeopleTab = require('../components/projectPeople');
var TaskTab = require('../components/projectTasks');


function ProjectPage(header) {
    this.header = header;
    this.element = document.createElement('div');
    this.element.className = 'project-page';
}

ProjectPage.prototype.onProjectDataReceived = function (project) {
    this.project = project;
    this.tabs = {
        activity: new ActivityTab(project),
        people: new PeopleTab(project),
        tasks: new TaskTab(project)
    };

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

    this.setTabContent();
};

ProjectPage.prototype.onRoute = function (root, projectId, tab) {
    if (/^activity$|^people$|^tasks$/.test(tab)) {
        this.tabName = tab;
        if (this.project && this.projectId === projectId) {
            this.setTabContent();
        }
        else {
            this.projectId = projectId;
            projectRef.get(projectId).then(this.onProjectDataReceived.bind(this));
        }
    }
    else {
        // Default to the activity screen
        location.replace('#projects/' + projectId + '/activity');
    }
};

ProjectPage.prototype.setTabContent = function () {
    if (this.tab) {
        this.tab.element.remove();
    }

    this.tab = this.tabs[this.tabName];
    this.element.appendChild(this.tab.element);
};

module.exports = ProjectPage;