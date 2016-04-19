import connection from '../firebase/connection';
import session from '../firebase/session';
import transform from '../firebase/transform';
import userCache from '../firebase/userCache';
import {projectTypeHasUpdate} from '../firebase/utility';
import defaultUserImage from '../images/profile-inverted.png';

import ActivityList from  '../components/activityList';
import MeetupList from '../components/meetupList';
import TaskList from '../components/taskList';
import UserList from '../components/userList';

var sections = {
    activities: ActivityList,
    meetups: MeetupList,
    people: UserList,
    tasks: TaskList
};


export default class ProjectPage {
    constructor(header) {
        this.header = header;
        header.update({style: 'transparent', leftAction: 'back'});
    }

    loadSection(sectionName) {
        var SectionType = sections[sectionName];
        if (SectionType && !(this.section instanceof SectionType)) {
            this.overlay = document.createElement('div');
            this.overlay.className = 'project__overlay';
            this.overlay.innerHTML = `
                <div class="overlay__content">
                    <button class="overlay__close">
                        <span class="fa fa-close" aria-hidden="true"></span>
                    </button>
                </div>`;

            this.section = new SectionType(this.project.id);
            if (this.section.element) {
                this.overlay.firstElementChild.appendChild(this.section.element);
            }
            else {
                this.section.render(this.project.id).then(function () {
                    this.overlay.firstElementChild.appendChild(this.section.element);
                }.bind(this));
            }

            this.overlay.addEventListener('click', this.onOverlayCloseClick.bind(this), false);
            document.body.appendChild(this.overlay);
            connection.viewProject(this.project.id, sectionName);
        }
    }

    onOverlayCloseClick(e) {
        var button = e.target.closest('.overlay__close');
        if (button) {
            history.back();
        }
    }

    onProjectChanged(snapshot) {
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
    }

    onRemove() {
        this.userProjectRef.off('value', this.updateViewed, this);
        connection.firebase.child('projects/' + this.projectId).off('value', this.onProjectChanged, this);

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;

            if (this.section.remove) {
                this.section.remove();
                this.section = null;
            }
        }
    }

    onRoute(root, projectId, section) {
        if (this.sectionName) {
            connection.viewProject(this.projectId, this.sectionName);
        }

        this.projectId = projectId;
        this.sectionName = section;

        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'project';
            this.element.innerHTML = `
                <div class="project__details">
                    <h2 class="project__name"></h2>
                    <a class="project__owner">
                        <img class="profile-image--small"/>
                        <span class="project__user-name"></span>
                    </a>
                </div>
                <div class="project__sections">
                    <a class="project__section" href="#projects/${projectId}/activities">
                        <span class="fa fa-comment" aria-hidden="true"></span>
                        <span class="project__section-title">Team Chat</span>
                    </a>
                    <a class="project__section" href="#projects/${projectId}/tasks">
                        <span class="fa fa-tasks" aria-hidden="true"></span>
                        <span class="project__section-title">Tasks</span>
                    </a>
                    <a class="project__section" href="#projects/${projectId}/people">
                        <span class="fa fa-users" aria-hidden="true"></span>
                        <span class="project__section-title">Team Members</span>
                    </a>
                    <a class="project__section" href="#projects/${projectId}/meetups">
                        <span class="fa fa-calendar-check-o" aria-hidden="true"></span>
                        <span class="project__section-title">Meet up</span>
                    </a>
                </div>`;

            this.sectionContainer = this.element.lastElementChild;
            connection.firebase.child('projects/' + projectId).on('value', this.onProjectChanged.bind(this));
            this.userProjectRef = connection.firebase.child('users/' + session.user.id + '/projects/' + projectId);
            this.userProjectRef.on('value', this.onUserProjectUpdated, this);
        }

        this.onRemove();
        if (this.project && section) {
            return this.loadSection(section);
        }
    }

    onUserProjectUpdated(snapshot) {
        this.updateViewed(snapshot.val());
    }

    setOwner(user) {
        this.projectOwner = user;
        if (user) {
            var ownerElement = this.element.querySelector('.project__owner');
            ownerElement.href = '#profile/' + user.id;
            ownerElement.lastElementChild.textContent = user.name;
            ownerElement.firstElementChild.src = user.image || defaultUserImage;
        }
    }

    updateHeader(project) {
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
    }

    updateViewed(userProjects) {
        if (userProjects && this.project) {
            var sections = ['activities', 'tasks', 'people', 'meetups'];
            var sectionElements = this.sectionContainer.children;
            for (var i = 0; i < sectionElements.length; i++) {
                sectionElements[i].classList.toggle('has-update', projectTypeHasUpdate(this.project, userProjects, sections[i]));
            }
        }
    }
}