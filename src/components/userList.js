import connection from '../firebase/connection';
import insertSorted from '../core/insertSorted';
import defaultUserImage from '../images/profile-red.png';


export default class UserList {
    constructor(projectId) {
        this.users = [];
        this.projectId = projectId;

        this.element = document.createElement('div');
        this.element.className = 'scrollable';
        this.element.innerHTML = '<ul class="user-list"></ul>';
        this.userList = this.element.firstElementChild;

        this.userRef = connection.firebase.child('projects/' + projectId + '/people');
        this.userRef.on('child_added', this.onProjectAdded, this);
        this.userRef.on('child_removed', this.onProjectRemoved, this);
    }

    onProjectAdded(snapshot) {
        var userId = snapshot.key();
        connection.getUser(userId).then(function (user) {
            var content = `
                <li class="list-item--image">
                    <a class="user" href="#profile/${user.id}">
                        <img class="profile-image" src="${user.image || defaultUserImage}"/>
                        <h2 class="user__name">${user.name}</h2>
                        <span class="user__email">${user.email}</span>
                    </a>
                </li>`;

            var index = insertSorted(this.users, user, (u1, u2) => u1.name.localeCompare(u2.name) > 0);
            var sibling = this.users[index - 1];
            if (sibling) {
                sibling.element.insertAdjacentHTML('afterend', content);
                user.element = sibling.element.nextElementSibling;
            }
            else {
                this.userList.insertAdjacentHTML('afterbegin', content);
                user.element = this.userList.firstElementChild;
            }
        }.bind(this));
    }

    onProjectRemoved(snapshot) {
        var userId = snapshot.key();
        var index = this.users.findIndex(user => user.id === userId);

        if (index >= 0) {
            this.users.splice(index, 1)[0].element.remove();
        }
    }

    remove() {
        this.userRef.off('child_added', this.onProjectAdded, this);
        this.userRef.off('child_removed', this.onProjectRemoved, this);
    }
}