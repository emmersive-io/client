import Form from '../forms/form';
import {getFormField} from '../forms/formField';
import connection from '../firebase/connection';

export default class ResetPasswordPage {
    constructor({header}) {
        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form form--infield">
                <div class="form__body">
                    ${getFormField('email')}
                </div>
                <p class="form__error"></p>
                <button class="button--full form__submit">Reset Password</button>
            </form>`;

        header.update({leftAction: 'back', style: 'transparent-dark'});

        var form = new Form(this.element.firstElementChild, function (data) {
            form.element.innerHTML = `<p class="zero-state-message">We've sent you an email. Please follow the instructions to reset your password.</p>`;
            connection.resetPassword(data.email);
        });
    }
}