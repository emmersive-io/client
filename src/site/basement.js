var firebase = require('../firebase/firebase').get();
var transform = require('../firebase/transform');
var session = require('../firebase/session');

var renderTemplate = require('../core/renderTemplate');
var itemTemplate = require('../templates/basementItem.handlebars');
var template = require('../templates/basement.handlebars');
var defaultUserImage = require('../images/profile-inverted.png');


function Basement(user) {
    this.element = renderTemplate(template({
        image: user.image || defaultUserImage,
        user: user
    }));

    this.projects = {};
    this.projectList = this.element.querySelector('.basement__project-list');
    this.element.addEventListener('click', function (e) {
        if (e.target.closest('[data-href]')) {
            document.body.classList.remove('show-basement');
        }
    }, false);

    // Listen to changes to the user
    this.userRef = firebase.child('users/' + user.id + '/projects');
    this.userRef.on('child_added', this.onProjectJoin, this);
    this.userRef.on('child_changed', this.onUserProjectDataChanged, this);
    this.userRef.on('child_removed', this.onProjectLeave, this);
}

Basement.prototype.hasUpdate = function (project) {
    var userProject = session.user.projects[project.id];
    return this.isNew(project, userProject, 'activities') ||
        this.isNew(project, userProject, 'meetups') ||
        this.isNew(project, userProject, 'people') ||
        this.isNew(project, userProject, 'tasks') || false;
};

Basement.prototype.isNew = function (project, userProject, type) {
    if (userProject) {
        var lastView = userProject[type];
        var lastChange = project['updated_' + type];
        return lastChange && (!lastView || lastView < lastChange);
    }
};

Basement.prototype.onUserProjectDataChanged = function (snapshot) {
    var projectId = snapshot.key();
    var project = this.projects[projectId];

    // Delay so the remaining updates can roll in and update session.user
    setTimeout(function () {
        project.element.classList.toggle('has-update', this.hasUpdate(project.data));
    }.bind(this), 0);
};

Basement.prototype.onProjectDataChanged = function (snapshot) {
    var projectData = transform.toObj(snapshot);
    var project = this.projects[projectData.id];
    if (!project) {
        return;
    }

    var hasNewName = (!project.data || project.data.name !== projectData.name);
    if (!project.element) {
        project.element = renderTemplate(itemTemplate({
            name: projectData.name,
            id: projectData.id
        }));
    }
    else if (hasNewName) {
        project.element.firstElementChild.textContent = projectData.name;
    }

    if (hasNewName) {
        var projectArray = Object.keys(this.projects)
            .map(function (key) { return this.projects[key]; }, this)
            .filter(function (project) { return project.data; })
            .sort(function (project1, project2) {
                return project1.data.name.localeCompare(project2.data.name);
            });

        var index = projectArray.indexOf(project) || 0;
        var nextProject = projectArray[index + 1];
        this.projectList.insertBefore(project.element, nextProject && nextProject.element);
    }

    project.data = projectData;
    project.element.classList.toggle('has-update', this.hasUpdate(projectData));
};

Basement.prototype.onProjectJoin = function (snapshot) {
    var projectId = snapshot.key();
    var project = {ref: firebase.child('projects/' + projectId)};
    project.ref.on('value', this.onProjectDataChanged, this);
    this.projects[projectId] = project;
};

Basement.prototype.onProjectLeave = function (snapshot) {
    var projectId = snapshot.key();
    var project = this.projects[projectId];
    if (project) {
        project.element.remove();
        project.ref.off('value', this.onUserProjectDataChanged, this);
        delete this.projects[projectId];
    }
};

Basement.prototype.remove = function () {
    this.element.remove();
    this.userRef.off('child_added', this.onProjectJoin, this);
    this.userRef.off('child_changed', this.onUserProjectDataChanged, this);
    this.userRef.off('child_removed', this.onProjectLeave, this);

    for (var key in this.projects) {
        this.projects[key].ref.off('value', this.onUserProjectDataChanged, this);
    }
};

module.exports = Basement;