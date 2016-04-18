import Firebase from './firebase';
import transform from './transform';

var connection = Firebase.get();

class Session {
    constructor() {
        this.isAuthenticating = true;
        connection.onAuth(function (authData) {
            if (authData) {
                connection.child('users/' + authData.uid)
                    .on('value', this.onUserChanged, this)
            }
            else {
                this.onLoggedOut();
            }
        }, this);
    }

    login(email, password) {
        this.isAuthenticating = true;
        return connection.authWithPassword({
            email: email,
            password: password
        });
    }

    logOut() {
        this.isAuthenticating = true;
        connection.unauth();
    }

    onUserChanged(snapshot) {
        this.isAuthenticating = false;
        this.user = transform.toObj(snapshot);
        this.resolveCallback();
    }

    onLoggedOut() {
        if (this.user) {
            connection.child('users/' + this.user.id)
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