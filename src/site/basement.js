import Firebase from '../firebase/firebase';
import transform from '../firebase/transform';
import session from '../firebase/session';
import defaultUserImage from '../images/profile-inverted.png';

var firebaseRoot = Firebase.get();

export default class Basement {
    constructor(user) {
        this.element = document.createElement('div');
        this.element.className = 'page page--basement';
        this.element.innerHTML = `
            <header class="header header--basement">
                <img class="basement__header-logo" src="${user.image || defaultUserImage}"/>
                <span class="basement__user-name text-truncate">${user.name}</span>
                <button class="basement__header-button transparent" data-href="#profile/${user.id}">
                    <span class="fa fa-gear" aria-hidden="true"></span>
                </button>
            </header>
            <div class="content content--basement">
                <button class="button--full" data-href="#projects/new">
                    <span class="fa fa-plus" aria-hidden="true"></span> Create a project
                </button>
                <button class="button--full" data-href="#projects">
                    <span class="fa fa-search" aria-hidden="true"></span> Find a project
                </button>
                <h3 class="basement__section-header">My Projects</h3>
                <ul class="basement__project-list"></ul>
            </div>`;

        this.projects = {};
        this.projectList = this.element.querySelector('.basement__project-list');
        this.element.addEventListener('click', function (e) {
            if (e.target.closest('[data-href]')) {
                document.body.classList.remove('show-basement');
            }
        }, false);

        // Listen to changes to the user
        this.userRef = firebaseRoot.child('users/' + user.id + '/projects');
        this.userRef.on('child_added', this.onProjectJoin, this);
        this.userRef.on('child_changed', this.onUserProjectDataChanged, this);
        this.userRef.on('child_removed', this.onProjectLeave, this);
    }

    hasUpdate(project) {
        var userProject = session.user.projects[project.id];
        return this.isNew(project, userProject, 'activities') ||
               this.isNew(project, userProject, 'meetups') ||
               this.isNew(project, userProject, 'people') ||
               this.isNew(project, userProject, 'tasks') || false;
    }

    isNew(project, userProject, type) {
        if (userProject) {
            var lastView = userProject[type];
            var lastChange = project['updated_' + type];
            return lastChange && (!lastView || lastView < lastChange);
        }
    }

    onUserProjectDataChanged(snapshot) {
        var projectId = snapshot.key();
        var project = this.projects[projectId];

        // Delay so the remaining updates can roll in and update session.user
        setTimeout(function () {
            project.element.classList.toggle('has-update', this.hasUpdate(project.data));
        }.bind(this), 0);
    }

    onProjectDataChanged(snapshot) {
        var projectData = transform.toObj(snapshot);
        var project = this.projects[projectData.id];
        if (!project) {
            return;
        }

        var hasNewName = (!project.data || project.data.name !== projectData.name);
        if (!project.element) {
            project.element = document.createElement('li');
            project.element.className = 'basement__project';
            project.element.innerHTML = `<a href="#projects/${projectData.id}">${projectData.name}</a>`;
        }
        else if (hasNewName) {
            project.element.firstElementChild.textContent = projectData.name;
        }

        if (hasNewName) {
            var projectArray = Object.keys(this.projects)
                .map(key => this.projects[key])
                .filter(project => project.data)
                .sort((p1, p2) => p1.data.name.localeCompare(p2.data.name));

            var index = projectArray.indexOf(project) || 0;
            var nextProject = projectArray[index + 1];
            this.projectList.insertBefore(project.element, nextProject && nextProject.element);
        }

        project.data = projectData;
        project.element.classList.toggle('has-update', this.hasUpdate(projectData));
    }

    onProjectJoin(snapshot) {
        var projectId = snapshot.key();
        var project = {ref: firebaseRoot.child('projects/' + projectId)};
        project.ref.on('value', this.onProjectDataChanged, this);
        this.projects[projectId] = project;
    }

    onProjectLeave(snapshot) {
        var projectId = snapshot.key();
        var project = this.projects[projectId];
        if (project) {
            project.element.remove();
            project.ref.off('value', this.onUserProjectDataChanged, this);
            delete this.projects[projectId];
        }
    }

    remove() {
        this.element.remove();
        this.userRef.off('child_added', this.onProjectJoin, this);
        this.userRef.off('child_changed', this.onUserProjectDataChanged, this);
        this.userRef.off('child_removed', this.onProjectLeave, this);

        for (var key in this.projects) {
            this.projects[key].ref.off('value', this.onUserProjectDataChanged, this);
        }
    }
}