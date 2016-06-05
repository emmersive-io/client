import firebase from './ref';
import transform from './transform';

class Session {
    constructor() {
        this.isAuthenticating = true;
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                firebase.root.child('users/' + user.uid)
                    .on('value', this.onUserChanged, this)
            }
            else {
                this.onLoggedOut();
            }
        }, this);
    }

    login(email, password) {
        this.isAuthenticating = true;
        return firebase.auth.signInWithEmailAndPassword({
            email: email,
            password: password
        });
    }

    logOut() {
        this.isAuthenticating = true;
        firebase.auth.signOut();
    }

    onUserChanged(snapshot) {
        this.isAuthenticating = false;
        this.user = transform.toObj(snapshot);
        this.resolveCallback();
    }

    onLoggedOut() {
        if (this.user) {
            firebase.root.child('users/' + this.user.id)
                .off('value', this.onUserChanged, this);
        }

        this.user = null;
        this.isAuthenticating = false;
        location.assign('#login');
        this.resolveCallback();
    }

    onUser(callback) {
        if (this.isAuthenticating) {
            this.callback = callback;
        }
        else {
            callback(this.user);
        }
    }

    resolveCallback() {
        if (this.callback) {
            this.callback(this.user);
            this.callback = null;
        }
    }
}

export default new Session();