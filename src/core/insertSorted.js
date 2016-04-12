module.exports = function (array, newItem, compare) {
    for (var i = array.length - 1; i >= 0; i--) {
        if (compare(newItem, array[i])) {
            array.splice(++i, 0, newItem);
            return i;
        }
    }

    array.unshift(newItem);
    return 0;
};