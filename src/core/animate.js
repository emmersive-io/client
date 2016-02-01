module.exports = function (element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
        element.offsetWidth; // Forcing style calculation
    }

    element.classList.add(className);
};