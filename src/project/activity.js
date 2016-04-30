import connection from '../firebase/connection';
import transform from '../firebase/transform';
import List from '../core/sortedElementList';
import ListItem from '../elements/activityListItem';

export default class ProjectActivity {
    constructor(project) {
        this.project = project;
        this.element = document.createElement('div');
        this.element.className = 'project-activity';
        this.element.innerHTML = `
            <ul class="activity-list scrollable"></ul>
            <form class="activity--new">
                <textarea class="activity--entry" placeholder="Send a message" aria-label="Message" rows="1"></textarea>
                <button><span class="fa fa-plus" aria-hidden="true"></span></button>
            </form>`;

        this.newActivity = this.element.lastElementChild;
        this.list = new List(this.element.firstElementChild, (a1, a2) => a1.created_at > a2.created_at);
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        this.activityRef = connection.firebase.child('activities/' + project.id);
        this.activityRef.on('child_added', this.onActivityAdded, this);
    }

    isAtBottom() {
        var element = this.list.element;
        var scrollBottom = element.clientHeight + element.scrollTop;
        return (element.scrollHeight - scrollBottom) <= 0;
    }

    onActivityAdded(snapshot) {
        var activity = transform.toObj(snapshot);
        connection.getUser(activity.created_by).then(function (user) {
            var wasAtBottom = this.isAtBottom();

            activity.created_by = user;
            this.list.add(new ListItem(activity));

            if (wasAtBottom && !this.isAtBottom()) {
                this.list.element.scrollTop = this.list.element.scrollHeight;
            }
        }.bind(this));
    }

    onNewActivity(e) {
        e.preventDefault();

        var content = this.newActivity.firstElementChild.value.trim();
        if (content) {
            connection.createActivity(this.project.id, content);
            this.newActivity.reset();
        }
    }

    remove() {
        this.activityRef.off('child_added', this.onProjectJoin, this);
    }
}