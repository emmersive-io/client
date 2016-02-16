module.exports = {
    fillUserData: function (ref, source, prop) {
        var userHash = {};
        var objects = Array.isArray(source) ? source : [source];

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            var userId = obj[prop];

            if (!userHash[userId]) {
                userHash[userId] = [];
            }

            userHash[userId].push(obj);
        }

        return this.requestArrayFromHash(ref, userHash).then(function (array) {
            for (var i = 0; i < array.length; i++) {
                var user = array[i];
                var sources = userHash[user.id];

                for (var j = 0; j < sources.length; j++) {
                    sources[j][prop] = user;
                }
            }

            return source;
        });
    },

    requestArrayFromHash: function (ref, hash) {
        return Promise.all(Object.keys(hash).map(function (key) {
            return ref.child(key).once('value');
        })).then(function (array) {
            return array.map(this.toObj);
        }.bind(this));
    },

    requestAsArray: function (ref, snapshot) {
        var keyHash = snapshot.val();
        return (keyHash && this.requestArrayFromHash(ref, keyHash)) || [];
    },

    toArray: function (snapshot) {
        var array = [];
        var obj = snapshot.val();

        for (var key in obj) {
            var item = obj[key];
            if (item) {
                item.id = key;
                array.push(item);
            }
        }

        return array;
    },

    toObj: function (snapshot) {
        var obj = snapshot.val();
        if (obj) {
            obj.id = snapshot.key();
        }

        return obj;
    }
};