import connection from '../firebase/connection';
import List from '../core/sortedElementList';
import ListItem from '../elements/userListItem';

export default class ProjectHome {
    constructor(header) {
        header.update({leftAction: 'back', title: 'Members'});
        this.element = document.createElement('div');
        this.element.className = 'project__members scrollable';
        this.list = new List(this.element, (u1, u2) => u1.user.name.localeCompare(u2.user.name) >= 0);
    }

    onRoute(root, projectId) {
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
        this.list.removeBy(item => item.user.id === userId);
    }

    remove() {
        this.userRef.off('child_added', this.onUserAdded, this);
        this.userRef.off('child_removed', this.onUserRemoved, this);
    }
}