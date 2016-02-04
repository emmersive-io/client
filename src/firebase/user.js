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

    get: function (userIds) {
        if (!Array.isArray(userIds)) {
            userIds = [userIds];
        }

        var requests = [];
        for (var i = 0; i < userIds.length; i++) {
            requests.push(userRef.child(userIds[i]).once('value'));
        }

        return Promise.all(requests).then(function (array) {
            if (array.length > 1) {
                return array.reduce(function (obj, snapshot) {
                    obj[snapshot.key()] = snapshot.val();
                    return obj;
                }, {});
            }

            return array[0].val();
        });
    },

    resetPassword: function () {
        return firebase.resetPassword();
    }
};