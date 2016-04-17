import session from '../firebase/session';
import animate from '../core/animate';
import logoPath from '../images/logo.png';

export default class LoginPage {
    constructor(header) {
        header.update({style: 'hidden'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `
            <form class="form-page__form">
                <img class="login__logo" src="${logoPath}">
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" required/>
                <input type="password" name="password" placeholder="Password" aria-label="password" autocomplete="current-password" required/>
                <button class="button--full">Let's Go</button>
                <div class="link-section">
                    <a href="#login/register">Register</a>
                    <span class="bullet-separator"></span>
                    <a href="#login/forgot-password">Forgot Password</a>
                </div>
            </form>`;

        this.element.firstElementChild.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }

    onFormSubmit(e) {
        e.preventDefault();

        var elements = e.target.elements;
        var email = elements.email.value.trim();
        var password = elements.password.value.trim();

        if (email && password) {
            session.login(email, password).then(function () {
                location.assign('#');
            }).catch(function () {
                animate(e.target, 'anim--shake');
            });
        }
    }
}