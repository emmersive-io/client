import session from '../firebase/session';
import defaultUserImage from '../images/profile-inverted.png';
import {ifDefined, safeString} from '../core/templateHelpers';

import getIcon from '../elements/icon';
import List from '../core/sortedElementList';
import ListItem from '../elements/userListItem';

export default class ProjectHome {
    constructor(project) {
        this.project = project;
        this.element = document.createElement('div');
        this.element.className = 'project__home scrollable';

        this.element.innerHTML = safeString`
            ${ifDefined`<img class="project__image" src="${project.image}"/>`}
            <div class="project__info">                    
                <h2 class="project__name">${project.name || 'Untitled Project'}</h2>
                <p class="project__description">${project.description}</p>
            </div>
            <div class="project__group">
                <h3 class="project__header">Members</h3>
                <ul class="project__member-list"></ul>                    
                <button class="button--link project__nav-button" data-href="#projects/${project.id}/members">
                    ${getIcon('chevron')}
                </button>
            </div>`;

        var projectInfo = this.element.querySelector('.project__info');
        this.nameElement = projectInfo.firstElementChild;
        this.descriptionElement = projectInfo.lastElementChild;

        session.userCache.get(project.created_by).then(user => {
            if (user) {
                projectInfo.insertAdjacentHTML('beforeend', `
                    <a class="project__owner" href="#profile/${user.id}">
                        <img class="profile-image--small" src="${user.image || defaultUserImage}"/>
                        <span class="project__user-name">${user.name}</span>
                    </a>`);
            }
        });

        this.list = new List(this.element.querySelector('.project__member-list'), (u1, u2) => u1.user.name.localeCompare(u2.user.name) >= 0);
        this.userRef = session.root.child('projects/' + this.project.id + '/people');
        this.userRef.on('child_added', this.onUserAdded, this);
        this.userRef.on('child_removed', this.onUserRemoved, this);
    }

    getHeaderAction() {
        if (this.project.created_by === session.user.id) {
            return {
                action: 'Edit',
                onAction: '#projects/' + this.project.id + '/edit'
            };
        }

        if (this.project.people[session.user.id]) {
            return {
                action: 'Leave',
                onAction: session.leaveProject.bind(session, this.project.id)
            };
        }

        return {
            action: 'Join',
            onAction: session.joinProject.bind(session, this.project.id)
        };
    }

    onProjectChanged(project) {
        if (this.project.name !== project.name) {
            this.nameElement.textContent = project.name;
        }

        if (this.project.description !== project.description) {
            this.descriptionElement.textContent = project.description;
        }

        this.project = project;
    }

    onUserAdded(snapshot) {
        session.userCache.get(snapshot.key).then(user => {
            this.list.add(new ListItem(user, true));
        });
    }

    onUserRemoved(snapshot) {
        var userId = snapshot.key;
        this.list.removeBy(item => item.user.id === userId);
    }

    remove() {
        this.userRef.off('child_added', this.onUserAdded, this);
        this.userRef.off('child_removed', this.onUserRemoved, this);
    }
}