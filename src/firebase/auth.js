var firebase = require('./connection');

module.exports = {
    createUser: function (name, email, password) {
        return firebase.createUser({
            email: email,
            password: password
        }).then(function (userData) {
            firebase.child('users').child(userData.uid).set({
                provider: 'password',
                email: email,
                name: name
            });

            // Automatically log the user in
            return this.login(email, password);
        }.bind(this));
    },

    get: function () {
        return firebase.getAuth();
    },

    isLoggedIn: function () {
        return this.get() ? true : false;
    },

    login: function (email, password) {
        return firebase.authWithPassword({
            email: email,
            password: password
        });
    },

    logOut: function () {
        firebase.unauth();
    },

    resetPassword: function (email) {
        return firebase.resetPassword({email: email});
    }
};