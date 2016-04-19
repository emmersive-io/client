import Firebase from '../firebase/firebase';
import transform from '../firebase/transform';
import session from '../firebase/session';
import List from '../core/sortedElementList';
import ListItem from '../elements/basementListItem';
import {projectHasUpdate} from '../firebase/utility';
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
        var listElement = this.element.querySelector('.basement__project-list');
        this.list = new List(listElement, (p1, p2) => p1.name.localeCompare(p2.name) >= 0);
        this.element.addEventListener('click', this.onItemClicked.bind(this), false);

        // Listen to changes to the user
        this.userRef = firebaseRoot.child('users/' + user.id + '/projects');
        this.userRef.on('child_added', this.onProjectJoin, this);
        this.userRef.on('child_changed', this.onUserProjectDataChanged, this);
        this.userRef.on('child_removed', this.onProjectLeave, this);
    }

    onItemClicked(e) {
        if (e.tagName === 'A' || e.target.closest('[data-href]')) {
            document.body.classList.remove('show-basement');
        }
    }

    onUserProjectDataChanged(snapshot) {
        // Delay so the remaining updates can roll in and update session.user
        setTimeout(function () {
            var project = this.projects[snapshot.key()];
            if (project && project.item) {
                project.item.element.classList.toggle('has-update', projectHasUpdate(project.item.data, session.user));
            }
        }.bind(this), 0);
    }

    onProjectDataChanged(snapshot) {
        var projectData = transform.toObj(snapshot);
        var project = projectData && this.projects[projectData.id];
        if (!project) {
            return;
        }

        if (project.item) {
            var name = project.item.name;
            project.item.name = projectData.name;

            if (name !== project.item.name) {
                this.list.remove(project.item);
                this.list.add(project.item);
            }
        }
        else {
            project.item = new ListItem(projectData);
            this.list.add(project.item);
        }

        project.item.element.classList.toggle('has-update', projectHasUpdate(projectData, session.user));
    }

    onProjectJoin(snapshot) {
        var projectId = snapshot.key();
        var ref = firebaseRoot.child('projects/' + projectId);
        this.projects[projectId] = {ref: ref};
        ref.on('value', this.onProjectDataChanged, this);
    }

    onProjectLeave(snapshot) {
        var projectId = snapshot.key();
        var project = this.projects[projectId];
        if (project) {
            project.item.element.remove();
            delete this.projects[projectId];
            project.ref.off('value', this.onUserProjectDataChanged, this);
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