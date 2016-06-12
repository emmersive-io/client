import connection from '../firebase/connection';
import session from '../firebase/session';
import defaultUserImage from '../images/profile.png';

export default class ProfilePage {
    constructor(options) {
        analytics.page("profile");
        
        this.header = options.header;
    }

    onInputChanged(e) {
        var value = e.target.value.trim();
        if (value) {
            connection.updateUser({[e.target.name]: value});
        }
    }

    onRoute(userId) {
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

        this.element = document.createElement('div');
        this.element.className = 'profile scrollable';

        if (this.isCurrentUser) {
            this.element.innerHTML = `
                <div class="form-page__form">
                    <img class="profile__image" src="${user.image || defaultUserImage}"/>
                    <input type="text" name="name" placeholder="Name" aria-label="name" autocomplete="name" value="${user.name}"/>
                    <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" value="${user.email}" readonly/>
                    <a class="form-link" href="https://docs.google.com/forms/d/1w6eUjTbOEvLoqF0lToI9z0ajsKqVJu1L7DrUKM1AgVQ/viewform?c=0&w=1" target="_blank">Send Feedback</a>
                    <div class="section-header"><span>Manage Account</span></div>
                    <button class="button--full button--change-email" data-href="#profile/change-email">Change Email</button>
                    <button class="button--full button--reset" data-href="#profile/change-password">Change Password</button>
                </div>`;
        }
        else {
            this.element.innerHTML = `
                <div class="form-page__form">
                    <img class="profile__image" src="${user.image || defaultUserImage}"/>
                    <h2 class="profile__name">${user.name}</h2>
                    <span class="profile__email">${user.email}</span>
                </div>`;
        }

        this.element.addEventListener('change', this.onInputChanged.bind(this), false);
    }
}