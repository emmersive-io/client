import connection from '../firebase/connection';
import transform from '../firebase/transform';

import moment from 'moment';
import insertSorted from '../core/insertSorted';
import defaultUserImage from '../images/profile-red.png';


export default class ActivityList {
    constructor(projectId) {
        this.items = [];
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
        this.activityList = this.element.firstElementChild;
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
        activity.date = moment(activity.created_at).fromNow();

        connection.getUser(activity.created_by).then(function (user) {
            var wasAtBottom = this.isAtBottom();
            var index = insertSorted(this.items, activity, (a1, a2) => a1.created_at > a2.created_at);

            var content = `
                <li class="list-item--image">
                    <img class="profile-image" src="${user.image || defaultUserImage}"/>
                    <a class="user-name" href="#profile/${user.id}">${user.name}</a>
                    <span class="item__date">${activity.date}</span>
                    <p class="item__description">${activity.description}</p>
                </li>`;


            var sibling = this.items[index - 1];
            if (sibling) {
                sibling.element.insertAdjacentHTML('afterend', content);
                activity.element = sibling.element.nextElementSibling;
            }
            else {
                this.activityList.insertAdjacentHTML('afterbegin', content);
                activity.element = this.activityList.firstElementChild;
            }

            if (wasAtBottom && !this.isAtBottom()) {
                this.scrollable.scrollTop = this.scrollable.scrollHeight;
            }
        }.bind(this));
    }

    onNewActivity(e) {
        e.preventDefault();

        var content = this.newActivity.elements[0].value.trim();
        if (content) {
            connection.createActivity(this.projectId, content);
            this.newActivity.reset();
        }
    }

    remove() {
        this.activityRef.off('child_added', this.onProjectJoin, this);
    }
}