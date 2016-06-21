import {animate} from '../core/animate';
import connection from '../firebase/connection';
import session from '../firebase/session';
import validate from '../core/validate';

export default class ChangePasswordPage {
    constructor(options) {
        analytics.page("change_password");

        this.router = options.router;
        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form">
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" required/>
                <input type="password" name="oldPassword" placeholder="Old Password" aria-label="old password" autocomplete="current-password" required/>
                <input type="password" name="newPassword" placeholder="New Password" aria-label="new password" autocomplete="new-password" required/>
                <button class="button--full">Change Password</button>
            </form>`;

        options.header.update({leftAction: 'back', style: 'transparent-dark'});
        this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }

    onFormSubmit(e) {
        e.preventDefault();

        var {data, isValid} = validate(e.target);
        if (isValid) {
            connection.firebase.changePassword(data)
                .then(function () {
                    this.router.navigateTo('#profile/' + session.user.id, {replace: true});
                }.bind(this))
                .catch(function (e) {
                    animate(e.target, 'anim--shake');
                });
        }
        else {
            animate(e.target, 'anim--shake');
        }
    }
}