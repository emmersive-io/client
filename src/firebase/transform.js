export default {
    toArray: function (snapshot) {
        var array = [];
        snapshot.forEach(function (itemSnapshot) {
            var item = itemSnapshot.val();
            if (item) {
                item.id = itemSnapshot.key;
                array.push(item);
            }
        });

        return array;
    },

    toObj: function (snapshot) {
        var obj = snapshot.val();
        if (obj) {
            obj.id = snapshot.key;
        }

        return obj;
    }
};