module.exports = {
    fillUserData: function (ref, source, props) {
        var userHash = {};
        var objects = Array.isArray(source) ? source : [source];
        props = Array.isArray(props) ? props : [props];

        for (var i = 0; i < objects.length; i++) {
            var obj = objects[i];
            for (var j = 0; j < props.length; j++) {
                var prop = props[j];
                var userId = obj[prop];
                if (userId) {
                    if (!userHash[userId]) {
                        userHash[userId] = [];
                    }

                    userHash[userId].push({prop: prop, obj: obj});
                }
            }
        }

        return this.requestArrayFromHash(ref, userHash).then(function (array) {
            for (var i = 0; i < array.length; i++) {
                var user = array[i];
                var matches = userHash[user.id];

                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];
                    match.obj[match.prop] = user;
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
        snapshot.forEach(function (itemSnapshot) {
            var item = itemSnapshot.val();
            if (item) {
                item.id = itemSnapshot.key();
                array.push(item);
            }
        });

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