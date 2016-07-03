import session from '../firebase/session';
import ImageUpload from '../elements/imageUpload';
import {safeString} from '../core/templateHelpers';
import defaultUserImage from '../images/profile.png';


export default class ProfilePage {
    constructor(options) {
        analytics.page('profile');
        this.header = options.header;
    }

    onInputChanged(e) {
        var value = e.target.name && e.target.value.trim();
        if (value) {
            session.user.update({[e.target.name]: value});
        }
    }

    onRoute(userId) {
        this.isCurrentUser = (session.user.id === userId);
        if (this.isCurrentUser) {
            this.render(session.user.data);
        }
        else {
            return session.userCache.get(userId).then(this.render.bind(this));
        }
    }

    render(user) {
        this.header.update({
            title: 'Profile',
            action: 'Log out',
            leftAction: 'back',
            onAction: () => session.logOut()
        });

        this.element = document.createElement('div');
        this.element.className = 'profile scrollable';

        var imageSource = user.image || defaultUserImage;
        if (this.isCurrentUser) {
            this.element.innerHTML = safeString`
                <div class="form-page__form">              
                    <input type="text" name="name" placeholder="Name" aria-label="name" autocomplete="name" value="${user.name}"/>
                    <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" value="${user.email}" readonly/>
                    <a class="form-link" href="https://docs.google.com/forms/d/1w6eUjTbOEvLoqF0lToI9z0ajsKqVJu1L7DrUKM1AgVQ/viewform?c=0&w=1" target="_blank">Send Feedback</a>
                    <div class="section-header"><span>Manage Account</span></div>
                    <button class="button--full button--change-email" data-href="#profile/change-email">Change Email</button>
                    <button class="button--full button--reset" data-href="#profile/change-password">Change Password</button>
                </div>`;

            var options = {className: 'profile__image', src: imageSource};
            var imageUpload = new ImageUpload(options, file => session.setProfileImage(file));
            this.element.insertBefore(imageUpload.element, this.element.firstElementChild);
        }
        else {
            this.element.innerHTML = safeString`
                <div class="form-page__form">
                    <img class="profile__image" src="${imageSource}"/>
                    <h2 class="profile__name">${user.name}</h2>
                    <span class="profile__email">${user.email}</span>
                </div>`;
        }

        this.element.addEventListener('change', this.onInputChanged.bind(this), false);
    }
}