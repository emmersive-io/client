import firebase from './ref';
import {storeImage} from './storage';
import transform from './transform';

class Session {
    constructor() {
        this.isAuthenticating = true;
        firebase.auth.onAuthStateChanged(function (user) {
            this.firebaseUser = user;
            if (user) {
                firebase.root.child('users/' + user.uid)
                    .on('value', this.onUserChanged, this)
            }
            else {
                this.onLoggedOut();
            }
        }.bind(this));
    }

    changeEmail(email) {
        return this.firebaseUser.updateEmail(email);
    }

    changePassword(password) {
        return this.firebaseUser.updatePassword(password);
    }

    login({email, password}) {
        this.isAuthenticating = true;
        return firebase.auth.signInWithEmailAndPassword(email, password)
            .catch(function (e) {
                this.isAuthenticating = false;
                throw e;
            }.bind(this));
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
        window.location.assign('#login');
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

    setProfileImage(file, metadata) {
        return storeImage(`users/${this.user.id}/image`, file, metadata);
    }
}

export default new Session();