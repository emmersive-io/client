import animate from '../core/animate';
import connection from '../firebase/connection';

export default class RegisterPage {
    constructor(header) {
        header.update({leftAction: 'back', style: 'transparent-dark'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `    
            <form class="form-page__form">
                <img class="profile__image" src="../images/profile.png"/>
                <input type="text" name="name" placeholder="Name" aria-label="name" autocomplete="name" required/>
                <div class="section-header"><span>Login</span></div>
                <input type="email" name="email" placeholder="Email" aria-label="email" autocomplete="email" required/>
                <input type="password" name="password" placeholder="Password" aria-label="password" autocomplete="new-password" required/>
                <input type="password" name="password2" placeholder="Confirm Password" aria-label="confirm password" autocomplete="new-password" required/>
                <button class="button--full">Register</button>
            </form>`;

        this.element.addEventListener('submit', this.onFormSubmit.bind(this), false);
    }

    onFormSubmit(e) {
        e.preventDefault();

        var elements = e.target.elements;
        var name = elements.name.value.trim();
        var email = elements.email.value.trim();
        var password = elements.password.value.trim();
        var password2 = elements.password2.value.trim();

        if (name && email && password && password === password2) {
            connection.createUser(name, email, password).then(function () {
                location.assign('#');
            }).catch(function () {
                animate(e.target, 'anim--shake');
            });
        }
        else {
            animate(e.target, 'anim--shake');
        }
    }
}