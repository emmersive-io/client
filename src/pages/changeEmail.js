import Form from '../forms/form';
import {getFormField} from '../forms/formField';
import session from '../firebase/session';

export default class ChangeEmailPage {
    constructor({header, router}) {
        analytics.page("change_email");
        header.update({leftAction: 'back', style: 'transparent-dark'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form form--infield">
                <div class="form__body">
                    ${getFormField({type: 'email', label: 'New Email Address'})}
                </div>
                <p class="form__error"></p>
                <button class="button--full form__submit">Change Email</button>
            </form>`;

        var form = new Form(this.element.firstElementChild, function (data) {
            session.changeEmail(data.email)
                .then(() => router.navigateTo('#profile/' + session.user.id, {replace: true}))
                .catch(e => form.setError(e.message));
        });
    }
}