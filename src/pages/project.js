var connection = require('../firebase/connection');
var session = require('../firebase/session');
var transform = require('../firebase/transform');
var renderTemplate = require('../core/renderTemplate');
var userCache = require('../firebase/userCache');

var template = require('../templates/project.handlebars');
var overlayTemplate = require('../templates/projectOverlay.html');
var defaultUserImage = require('../images/profile-inverted.png');

var sections = {
    activities: require('../components/activityList'),
    meetups: require('../components/meetupList'),
    people: require('../components/userList'),
    tasks: require('../components/taskList')
};

function isNew(project, userProject, type) {
    var lastView = userProject[type];
    var lastContent = project['updated_' + type];
    return (lastContent && (!lastView || lastView < lastContent)) || false;
}


function ProjectPage(header) {
    this.header = header;
    header.update({style: 'transparent', leftAction: 'back'});
}

ProjectPage.prototype.loadSection = function (sectionName) {
    var SectionType = sections[sectionName];
    if (SectionType) {
        this.overlay = renderTemplate(overlayTemplate);
        this.section = new SectionType(this.project.id);

        var overlayContent = this.overlay.querySelector('.overlay__content');
        if (this.section.element) {
            overlayContent.appendChild(this.section.element);
        }
        else {
            this.section.render(this.project.id).then(function () {
                overlayContent.appendChild(this.section.element);
            }.bind(this));
        }

        this.overlay.addEventListener('click', this.onOverlayCloseClick.bind(this), false);
        document.body.appendChild(this.overlay);
        connection.viewProject(this.project.id, sectionName);
    }
};

ProjectPage.prototype.onOverlayCloseClick = function (e) {
    var button = e.target.closest('.overlay__close');
    if (button) {
        history.back();
    }
};

ProjectPage.prototype.onProjectChanged = function (snapshot) {
    var project = transform.toObj(snapshot);
    if (project) {
        if (this.projectName !== project.name) {
            this.projectName = project.name;
            this.element.querySelector('.project__name').textContent = project.name;
        }

        if (this.projectImage !== project.image) {
            this.projectImage = project.image;
            this.element.querySelector('.project__details').style.backgroundImage = 'url(' + project.image + ')';
        }

        this.project = project;
        this.updateHeader(project);
        this.updateViewed(session.user.projects && session.user.projects[project.id]);
        if (!this.projectOwner) {
            userCache.get(project.created_by).then(this.setOwner.bind(this));
        }

        this.loadSection(this.sectionName);
    }
};

ProjectPage.prototype.onRemove = function () {
    this.userProjectRef.off('value', this.updateViewed, this);
    connection.firebase.child('projects/' + this.projectId).off('value', this.onProjectChanged, this);

    if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;

        if (this.section.remove) {
            this.section.remove();
        }
    }
};

ProjectPage.prototype.onRoute = function (root, projectId, section) {
    this.projectId = projectId;
    this.sectionName = section;

    if (!this.element) {
        this.element = renderTemplate(template({id: projectId}));
        this.sectionContainer = this.element.querySelector('.project__sections');

        connection.firebase.child('projects/' + projectId).on('value', this.onProjectChanged.bind(this));
        this.userProjectRef = connection.firebase.child('users/' + session.user.id + '/projects/' + projectId);
        this.userProjectRef.on('value', this.onUserProjectUpdated, this);
    }

    this.onRemove();
    if (this.project && section) {
        return this.loadSection(section);
    }
};

ProjectPage.prototype.onUserProjectUpdated = function (snapshot) {
    this.updateViewed(snapshot.val());
};

ProjectPage.prototype.setOwner = function (user) {
    this.projectOwner = user;
    if (user) {
        var ownerElement = this.element.querySelector('.project__owner');
        ownerElement.href = '#profile/' + user.id;
        ownerElement.lastElementChild.textContent = user.name;
        ownerElement.firstElementChild.src = user.image || defaultUserImage;
    }
};

ProjectPage.prototype.updateHeader = function (project) {
    var action, onAction;
    if (project.created_by === session.user.id) {
        action = 'Edit Project';
        onAction = '#projects/' + project.id + '/edit';
    }
    else if (project.people[session.user.id]) {
        action = 'Leave Project';
        onAction = connection.leaveProject.bind(connection, this.project.id);
    }
    else {
        action = 'Join Project';
        onAction = connection.joinProject.bind(connection, this.project.id);
    }

    if (this.headerAction !== action) {
        this.headerAction = action;
        this.header.update({
            action: action,
            onAction: onAction,
            style: 'transparent',
            leftAction: 'back'
        });
    }
};

ProjectPage.prototype.updateViewed = function (userViewData) {
    if (userViewData && this.project) {
        var sections = ['activities', 'people', 'tasks', 'meetups'];
        var sectionElements = this.sectionContainer.children;
        for (var i = 0; i < sectionElements.length; i++) {
            sectionElements[i].classList.toggle('has-update', isNew(this.project, userViewData, sections[i]));
        }
    }
};

module.exports = ProjectPage;