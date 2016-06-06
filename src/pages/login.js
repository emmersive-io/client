import Form from '../forms/form';
import {getFormField} from '../forms/formField';
import logoPath from '../images/logo.png';
import session from '../firebase/session';

export default class LoginPage {
    constructor({header, router}) {
        header.update({style: 'hidden'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form form--infield">
                <img class="login__logo" src="${logoPath}" />
                <div class="form__body">
                    ${getFormField('email')}
                    ${getFormField('password')}
                </div>
                <p class="form__error"></p>
                <button class="button--full form__submit">Let's Go</button>
                <div class="link-section">
                    <a href="#login/register">Register</a>
                    <span class="bullet-separator"></span>
                    <a href="#login/forgot-password">Forgot Password</a>
                </div>
            </form>`;

        var form = new Form(this.element.firstElementChild, function (data) {
            session.login(data)
                .then(() => router.navigateTo('#', {replace: true}))
                .catch(e => form.setError(e.message));
        });
    }
}