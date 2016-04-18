import connection from '../firebase/connection';
import List from '../core/sortedElementList';
import ListItem from '../elements/userListItem';


export default class UserList {
    constructor(projectId) {
        this.users = [];
        this.projectId = projectId;

        this.element = document.createElement('div');
        this.element.className = 'scrollable';
        this.element.innerHTML = '<ul class="user-list"></ul>';
        this.list = new List(this.element.firstElementChild, (u1, u2) => u1.name.localeCompare(u2.name) >= 0);

        this.userRef = connection.firebase.child('projects/' + projectId + '/people');
        this.userRef.on('child_added', this.onUserAdded, this);
        this.userRef.on('child_removed', this.onUserRemoved, this);
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
}