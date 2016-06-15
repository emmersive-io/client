import firebase from './ref';
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
        return new Promise((resolve, reject) => {
            var path = this.user.id + '/image';
            var uploadTask = firebase.storage.child(path).put(file, metadata);

            uploadTask.on('state_changed', null,
                (error) => { reject(error); },
                () => {
                    var url = uploadTask.snapshot.metadata.downloadURLs[0];
                    firebase.root.child('users/' + path).set(url);
                    return resolve(url);
                });
        });
    }
}

export default new Session();