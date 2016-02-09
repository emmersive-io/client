var firebase = require('./connection');
var userRef = firebase.child('users');

module.exports = {
    changePassword: function (email, oldPassword, newPassword) {
        return firebase.changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    },

    get: function (userId) {
        return userRef.child(userId).once('value').then(function (snapshot) {
            return Object.assign(snapshot.val(), {id: snapshot.key()});
        });
    },

    getHash: function (users) {
        var requests = [];
        for (var i = 0; i < users.length; i++) {
            requests.push(userRef.child(users[i]).once('value'));
        }

        return Promise.all(requests).then(function (array) {
            return array.reduce(function (obj, snapshot) {
                obj[snapshot.key()] = snapshot.val();
                return obj;
            }, {});
        });
    },

    resetPassword: function () {
        return firebase.resetPassword();
    }
};