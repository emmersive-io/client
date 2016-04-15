var connection = require('./firebase').get();
var transform = require('./transform');

function Session() {
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

Session.prototype = {
    isAuthenticating: true,

    login: function (email, password) {
        this.isAuthenticating = true;
        return connection.authWithPassword({
            email: email,
            password: password
        });
    },

    logOut: function () {
        this.isAuthenticating = true;
        connection.unauth();
    },

    onUserChanged: function (snapshot) {
        this.isAuthenticating = false;
        this.user = transform.toObj(snapshot);
        this.resolveCallback();
    },

    onLoggedOut: function () {
        if (this.user) {
            connection.child('users/' + this.user.id)
                .off('value', this.onUserChanged, this);
        }

        this.user = null;
        this.isAuthenticating = false;
        location.assign('#login');
        this.resolveCallback();
    },

    onUser: function (callback) {
        if (this.isAuthenticating) {
            this.callback = callback;
        }
        else {
            callback(this.user);
        }
    },

    resolveCallback: function () {
        if (this.callback) {
            this.callback(this.user);
            this.callback = null;
        }
    }
};

module.exports = new Session();
