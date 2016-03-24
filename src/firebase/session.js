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
    login: function (email, password) {
        return connection.authWithPassword({
            email: email,
            password: password
        });
    },

    logOut: function () {
        connection.unauth();
    },

    onUserChanged: function (snapshot) {
        this.user = transform.toObj(snapshot);
        this.resolveCallback();
    },

    onLoggedOut: function () {
        if (this.user) {
            connection.child('users/' + this.user.id)
                .off('value', this.onUserChanged, this);
        }

        this.user = null;
        location.assign('#login');
        this.resolveCallback();
    },

    onUser: function (callback) {
        if (this.user === undefined) {
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
