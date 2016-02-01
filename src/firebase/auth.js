var firebase = require('./connection');

module.exports = {
    createUser: function (name, email, password, callback) {
        firebase.createUser({email: email, password: password}, function (error, userData) {
            if (error) {
                callback(error.message);
            }
            else {
                firebase.child('users').child(userData.uid).set({
                    provider: 'password',
                    name: name,
                    email: email
                });

                // Automatically log the user in
                this.login(email, password, callback);
            }
        }.bind(this));
    },

    get: function () {
        // TODO: Should probably switch to onAuth to prevent a synchronous XMLHttpRequest
        return firebase.getAuth();
    },

    isLoggedIn: function () {
        return this.get() ? true : false;
    },

    login: function (email, password, callback) {
        if (email && password) {
            firebase.authWithPassword({email: email, password: password}, function (error) {
                callback(error && error.message);
            });
        }
        else {
            callback('Empty Field');
        }
    },

    logOut: function () {
        firebase.unauth();
    },

    resetPassword: function (email) {
        firebase.resetPassword({email: email}, function () {
            // This will error if the user doesn't exist. Don't think we care . . .
        });
    }
};