import {humanizeDate} from '../core/humanize';
import {safeString} from '../core/templateHelpers';
import defaultUserImage from '../images/profile-red.png';

export default class ActivityListItem {
    constructor(activity) {
        this.activity = activity;
        this.element = document.createElement('li');
        this.element.className = 'list-item--image';

        var user = activity.created_by;
        var dateString = humanizeDate(activity.created_at);

        this.element.innerHTML = safeString`
            <img class="profile-image--small" src="${user.image || defaultUserImage}"/>
            <a class="user-name" href="#profile/${user.id}">${user.name}</a>
            <span class="item__date">${dateString}</span>
            <p class="item__description">${activity.description}</p>`;
    }

    get created_at() {
        return this.activity.created_at;
    }
}