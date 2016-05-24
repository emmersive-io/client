import defaultUserImage from '../images/profile-red.png';

export default class UserListItem {
    constructor(user, isPreview) {
        this.user = user;
        this.element = document.createElement('li');

        if (isPreview === true) {
            this.element.className = 'list-item--thumb';
            this.element.innerHTML = `
                <a href="#profile/${user.id}" title="${user.name}">
                    <img class="profile-image--medium" src="${user.image || defaultUserImage}"/>
                </a>`;
        }
        else {
            this.element.className = 'list-item--image';
            this.element.innerHTML = `
                <a href="#profile/${user.id}">
                    <img class="profile-image--small" src="${user.image || defaultUserImage}"/>
                    <h2 class="user__name">${user.name}</h2>
                    <span class="user__email">${user.email}</span>
                </a>`;
        }
    }
}