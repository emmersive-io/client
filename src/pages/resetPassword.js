import {animate} from '../core/animate';
import connection from '../firebase/connection';

export default class ResetPasswordPage {
    constructor(options) {
        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form">
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" required/>
                <button class="button--full">Reset Password</button>
            </form>`;

        options.header.update({leftAction: 'back', style: 'transparent-dark'});
        this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }

    onFormSubmit(e) {
        e.preventDefault();

        var email = e.target.elements.email.value.trim();
        if (email) {
            connection.resetPassword(email);
            e.target.innerHTML = `<p class="zero-state-message">We've sent you an email. Please follow the instructions to reset your password.</p>`;
        }
        else {
            animate(e.target, 'anim--shake');
        }
    }
}