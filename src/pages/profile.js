import connection from '../firebase/connection';
import session from '../firebase/session';
import defaultUserImage from '../images/profile.png';

export default class ProfilePage {
    constructor(header) {
        this.header = header;
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
        this.header.update({
            title: 'Profile',
            action: 'Log out',
            leftAction: 'back',
            onAction: function () {
                session.logOut();
            }
        });

        var userActions = '';
        if (this.isCurrentUser) {
            userActions = `
                <a class="form-link" href="https://docs.google.com/forms/d/1w6eUjTbOEvLoqF0lToI9z0ajsKqVJu1L7DrUKM1AgVQ/viewform?c=0&w=1" target="_blank">Send Feedback</a>
                <div class="section-header"><span>Manage Account</span></div>
                <button class="button--full button--change-email">Change Email</button>
                <button class="button--full button--reset" data-href="#profile/forgot-password">Reset Password</button>`;
        }

        var content = `
            <div class="form-page__form">
                <img class="profile__image" src="${user.image || defaultUserImage}"/>
                <input type="text" name="name" placeholder="Name" aria-label="name" autocomplete="name" value="${user.name}"/>
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" value="${user.email}"/>
                ${userActions}
            </div>`;


        this.element = document.createElement('div');
        this.element.className = 'profile form-page scrollable';
        this.element.innerHTML = content;

        if (!this.isCurrentUser) {
            var inputs = this.element.getElementsByTagName('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = true;
            }
        }
    }
}