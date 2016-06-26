import session from '../firebase/session';
import {toObj} from '../firebase/utility/transform';
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
                <textarea class="activity--entry" placeholder="Enter your message..." aria-label="Message" rows="1"></textarea>
                <button class="button--link" type="submit">Send</button>
            </form>`;

        this.newActivity = this.element.lastElementChild;
        this.list = new List(this.element.firstElementChild, (a1, a2) => a1.created_at > a2.created_at);
        this.newActivity.addEventListener('submit', this.onNewActivity.bind(this), false);

        this.activityRef = session.root.child('activities/' + project.id);
        this.activityRef.on('child_added', this.onActivityAdded, this);
    }

    isAtBottom() {
        var element = this.list.element;
        var scrollBottom = element.clientHeight + element.scrollTop;
        return (element.scrollHeight - scrollBottom) <= 0;
    }

    onActivityAdded(snapshot) {
        var activity = toObj(snapshot);
        session.userCache.get(activity.created_by).then(user => {
            var wasAtBottom = this.isAtBottom();

            activity.created_by = user;
            this.list.add(new ListItem(activity));

            if (wasAtBottom && !this.isAtBottom()) {
                this.list.element.scrollTop = this.list.element.scrollHeight;
            }
        });
    }

    onNewActivity(e) {
        e.preventDefault();

        var content = this.newActivity.firstElementChild.value.trim();
        if (content) {
            session.createActivity(this.project.id, content);
            this.newActivity.reset();
        }
    }

    remove() {
        this.activityRef.off('child_added', this.onProjectJoin, this);
    }
}