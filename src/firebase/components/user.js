import {toObj} from '../utility/transform';

export default class User {
    constructor({auth, root}) {
        this.isAuthenticating = true;
        this.usersRef = root.child('users');

        auth.onAuthStateChanged(user => {
            if (user) {
                this.user = user;
                this.usersRef.child(this.id).on('value', this.onUserChanged, this);
            }
            else {
                if (this.user) {
                    this.usersRef.child(this.id).off('value', this.onUserChanged, this);
                    this.user = null;
                }

                this.onUserChanged();
                location.assign('#login');
            }
        });
    }

    get id() { return this.user && this.user.uid; }
    get data() { return this.userData; }

    changeEmail(email) {
        return this.user.updateEmail(email);
    }

    changePassword(password) {
        return this.user.updatePassword(password);
    }

    get(callback) {
        if (this.isAuthenticating) {
            this.callback = callback;
        }
        else {
            callback(this);
        }
    }

    onUserChanged(snapshot) {
        this.isAuthenticating = false;
        this.userData = toObj(snapshot);

        if (this.callback) {
            this.callback(this);
            this.callback = null;
        }
    }

    update(data) {
        this.usersRef.child(this.id).update(data);
    }
}