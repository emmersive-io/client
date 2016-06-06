import Form from '../forms/form';
import {getFormField} from '../forms/formField';
import session from '../firebase/session';

export default class ChangePasswordPage {
    constructor({header, router}) {
        header.update({leftAction: 'back', style: 'transparent-dark'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form form--infield">
                <div class="form__body">
                    ${getFormField({id: 'password', type: 'passwordNew'})}
                </div>
                <p class="form__error"></p>
                <button class="button--full form__submit">Change Password</button>
            </form>`;

        var form = new Form(this.element.firstElementChild, function (data) {
            session.changePassword(data.password)
                .then(() => router.navigateTo('#profile/' + session.user.id, {replace: true}))
                .catch((e) => form.setError(e.message));
        });
    }
}