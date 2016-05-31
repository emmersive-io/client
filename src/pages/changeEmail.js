import {animate} from '../core/animate';
import connection from '../firebase/connection';
import session from '../firebase/session';
import validate from '../core/validate';

export default class ChangePasswordPage {
    constructor(options) {
        this.router = options.router;
        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form">
                <input type="email" name="oldEmail" placeholder="Old email" aria-label="old email" autocomplete="email" required/>
                <input type="email" name="newEmail" placeholder="New email" aria-label="new email" autocomplete="email" required/>
                <input type="password" name="password" placeholder="Password" aria-label="password" autocomplete="current-password" required/>
                <button class="button--full">Change Email</button>
            </form>`;

        options.header.update({leftAction: 'back', style: 'transparent-dark'});
        this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }

    onFormSubmit(e) {
        e.preventDefault();

        var {data, isValid} = validate(e.target);
        if (isValid) {
            connection.firebase.changeEmail(data)
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