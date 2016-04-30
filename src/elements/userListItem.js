import defaultUserImage from '../images/profile-red.png';

export default class UserListItem {
    constructor(user) {
        this.user = user;
        this.element = document.createElement('li');
        this.element.className = 'list-item--image';
        this.element.innerHTML = `
            <a class="user" href="#profile/${user.id}">
                <img class="profile-image--small" src="${user.image || defaultUserImage}"/>
                <h2 class="user__name">${user.name}</h2>
                <span class="user__email">${user.email}</span>
            </a>`;
    }
}