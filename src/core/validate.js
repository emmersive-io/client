export default function (form) {
    var data = {};
    var isValid = true;

    for (var i = 0; i < form.elements.length; i++) {
        var element = form.elements[i];

        if (element.name) {
            var value = element.value.trim();
            data[element.name] = value;

            if (isValid && element.required && (!value || !element.validity.valid)) {
                isValid = false;
            }
        }
    }

    return {data, isValid};
}