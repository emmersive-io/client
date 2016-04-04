module.exports = function (template, obj) {
    var div = document.createElement('div');
    div.innerHTML = template;
    return  div.firstElementChild;
};