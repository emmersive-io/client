import session from '../firebase/session';
import Form from '../forms/form';
import {getFormField} from '../forms/formField';
import profileImage from '../images/profile.png';


export default class RegisterPage {
    constructor({header, router}) {
        analytics.page('register');
        header.update({leftAction: 'back', style: 'transparent-dark'});

        this.element = document.createElement('div');
        this.element.className = 'form-page scrollable';
        this.element.innerHTML = `    
            <form class="form-page__form form--infield">
                <img class="profile__image" src="${profileImage}"/>
                <div class="form__body">
                    ${getFormField('name')}
                    ${getFormField('email')}
                    ${getFormField({id: 'password', type: 'passwordNew'})}          
                </div>
                <p class="form__error" role="alert"></p>
                <button class="button--full form__submit">Register</button>
                <a class="form-link" href="#login">Log into an existing account</a>
            </form>`;

        var form = new Form(this.element.firstElementChild, function (data) {
            session.createUser(data)
                .then(() => {
                    analytics.identify(data.name);
                    analytics.track('Registered', {
                        name: data.name,
                        email: data.email
                    });

                    router.navigateTo('#', {replace: true})
                })
                .catch(e => form.setError(e.message));
        });
    }
}