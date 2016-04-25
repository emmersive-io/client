import connection from '../firebase/connection';
import session from '../firebase/session';
import userCache from '../firebase/userCache';
import defaultUserImage from '../images/profile-red.png';

import List from '../core/sortedElementList';
import ListItem from '../elements/userListItem';

export default class ProjectHome {
    constructor(project) {
        this.users = [];
        this.project = project;

        this.element = document.createElement('div');
        this.element.className = 'project__home scrollable';
        this.element.innerHTML = `                
                <h2 class="project__name">${project.name}</h2>
                <p class="project__description">${project.description}</p>
                <a class="project__owner">
                    <img class="profile-image--small"/>
                    <span class="project__user-name"></span>
                </a>                
                <h3 class="project__header">Members</h3>
                <ul class="user-list"></ul>`;

        this.nameElement = this.element.children[0];
        this.descriptionElement = this.element.children[1];
        this.list = new List(this.element.lastElementChild, (u1, u2) => u1.name.localeCompare(u2.name) >= 0);

        userCache.get(project.created_by).then(this.setOwner.bind(this));
        this.userRef = connection.firebase.child('projects/' + this.project.id + '/people');
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
                onAction: connection.leaveProject.bind(connection, this.project.id)
            };
        }

        return {
            action: 'Join',
            onAction: connection.joinProject.bind(connection, this.project.id)
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
        var userId = snapshot.key();
        connection.getUser(userId).then(function (user) {
            this.list.add(new ListItem(user));
        }.bind(this));
    }

    onUserRemoved(snapshot) {
        var userId = snapshot.key();
        this.list.removeBy(user => user.id === userId);
    }

    remove() {
        this.userRef.off('child_added', this.onUserAdded, this);
        this.userRef.off('child_removed', this.onUserRemoved, this);
    }

    setOwner(user) {
        if (user) {
            var ownerElement = this.element.querySelector('.project__owner');
            ownerElement.href = '#profile/' + user.id;
            ownerElement.lastElementChild.textContent = user.name;
            ownerElement.firstElementChild.src = user.image || defaultUserImage;
        }
    }
}