import connection from '../firebase/connection';
import transform from '../firebase/transform';
import List from '../core/sortedElementList';
import ListItem from '../elements/activityListItem';

export default class ActivityList {
    constructor(projectId) {
        this.projectId = projectId;
        this.element = document.createElement('div');
        this.element.className = 'scrollable';
        this.element.innerHTML = `
            <ul class="activity-list"></ul>
            <form class="activity--new">
                <textarea class="activity--entry" placeholder="Message" aria-label="Message" rows="1"></textarea>
                <button><span class="fa fa-plus" aria-hidden="true"></span></button>
            </form>`;

        this.newActivity = this.element.lastElementChild;
        this.list = new List(this.element.firstElementChild, (a1, a2) => a1.created_at > a2.created_at);
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        this.activityRef = connection.firebase.child('activities/' + projectId);
        this.activityRef.on('child_added', this.onActivityAdded, this);
    }

    isAtBottom() {
        if (!this.scrollable) {
            this.scrollable = this.element.closest('.scrollable');
        }

        var scrollBottom = this.scrollable.clientHeight + this.scrollable.scrollTop;
        return (this.scrollable.scrollHeight - scrollBottom) <= 0;
    }

    onActivityAdded(snapshot) {
        var activity = transform.toObj(snapshot);
        connection.getUser(activity.created_by).then(function (user) {
            var wasAtBottom = this.isAtBottom();

            activity.created_by = user;
            this.list.add(new ListItem(activity));

            if (wasAtBottom && !this.isAtBottom()) {
                this.scrollable.scrollTop = this.scrollable.scrollHeight;
            }
        }.bind(this));
    }

    onNewActivity(e) {
        e.preventDefault();

        var content = this.newActivity.firstElementChild.value.trim();
        if (content) {
            connection.createActivity(this.projectId, content);
            this.newActivity.reset();
        }
    }

    remove() {
        this.activityRef.off('child_added', this.onProjectJoin, this);
    }
}