import connection from '../firebase/connection';
import session from '../firebase/session';
import defaultUserImage from '../images/profile.png';

export default class ProfilePage {
    constructor(header) {
        this.header = header;
    }

    onClick(e) {
        var button = e.target.closest('button');
        if (button && button.classList.contains('button--log-out')) {
            session.logOut();
        }
    }

    onRoute(root, userId) {
        this.isCurrentUser = (session.user.id === userId);
        if (this.isCurrentUser) {
            this.render(session.user);
        }
        else {
            return connection.getUser(userId).then(this.render.bind(this));
        }
    }

    render(user) {
        var userActions = '';
        if (this.isCurrentUser) {
            userActions = `
                <button class="button--full button--log-out">Log out</button>
                <button class="button--full button--change-email">Change Email</button>
                <button class="button--full button--reset" data-href="#login/forgot-password">Reset Password</button>`;
        }

        var content = `
            <div class="form-page__form">
                <img class="profile__image" src="${user.image || defaultUserImage}"/>
                <input type="text" name="name" placeholder="Name" aria-label="name" autocomplete="name" value="${user.name}"/>
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" value="${user.email}"/>
                ${userActions}
            </div>`;

        this.header.update({title: 'Profile', leftAction: 'back'});
        this.element = document.createElement('div');
        this.element.className = 'profile form-page scrollable';
        this.element.innerHTML = content;

        if (this.isCurrentUser) {
            this.element.addEventListener('click', this.onClick.bind(this), false);
        }
        else {
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = true;
            }
        }
    }
}