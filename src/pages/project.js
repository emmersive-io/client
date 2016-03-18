var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');

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
    return lastContent && (!lastView || lastView < lastContent);
}


function ProjectPage(header) {
    this.header = header;
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

ProjectPage.prototype.onLeaveProject = function () {
    connection.leaveProject(this.project.id);
    this.project.people[this.user.id] = false;
    this.updateHeader();
};

ProjectPage.prototype.onJoinProject = function () {
    connection.joinProject(this.project.id);
    this.project.people[this.user.id] = true;
    this.updateHeader();
};

ProjectPage.prototype.onOverlayCloseClick = function (e) {
    var button = e.target.closest('.overlay__close');
    if (button) {
        history.back();
    }
};

ProjectPage.prototype.onRoute = function (root, projectId, section) {
    this.onRemove();
    if (this.project) {
        if (section) {
            return this.loadSection(section);
        }
    }
    else {
        return Promise.all([
            connection.getUser(connection.getAuth().uid),
            connection.getProject(projectId)
        ]).then(function (data) {
            this.user = data[0];
            this.project = data[1];

            if (!this.project.created_by.image) {
                this.project.created_by.image = defaultUserImage;
            }

            var userProject = this.user.projects && this.user.projects[this.project.id];
            if (userProject) {
                this.project.newActivity = isNew(this.project, userProject, 'activities');
                this.project.newMeetups = isNew(this.project, userProject, 'meetups');
                this.project.newPeople = isNew(this.project, userProject, 'people');
                this.project.newTasks = isNew(this.project, userProject, 'tasks');
            }

            this.updateHeader();
            this.element = renderTemplate(template(this.project));
            if (this.project.image) {
                this.element.querySelector('.project__details').style.backgroundImage = 'url(' + this.project.image + ')';
            }

            return this.loadSection(section);
        }.bind(this));
    }
};

ProjectPage.prototype.onRemove = function () {
    if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
    }
};

ProjectPage.prototype.updateHeader = function () {
    var headerOptions = {
        style: 'transparent',
        leftAction: 'back'
    };

    if (this.project.created_by.id === this.user.id) {
        headerOptions.action = 'Edit Project';
        headerOptions.onAction = '#projects/' + this.project.id + '/edit';
    }
    else if (this.project.people[this.user.id]) {
        headerOptions.action = 'Leave Project';
        headerOptions.onAction = this.onLeaveProject.bind(this);
    }
    else {
        headerOptions.action = 'Join Project';
        headerOptions.onAction = this.onJoinProject.bind(this);
    }

    this.header.update(headerOptions);
};

module.exports = ProjectPage;