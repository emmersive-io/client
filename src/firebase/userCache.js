var connection = require('./firebase').get();
var userRef = connection.child('users');

module.exports = {
    cache: {},
    get: function (userId) {
        var promise = this.cache[userId];
        if (!promise) {
            promise = userRef.child(userId).once('value').then(function (snapshot) {
                var user = snapshot.val();
                if (user) {
                    user.id = snapshot.key();
                    this.cache[user.id] = Promise.resolve(user);
                    return user;
                }
            }.bind(this));

            this.cache[userId] = promise;
        }

        return promise;
    }
};
