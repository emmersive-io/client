import {animate} from '../core/animate';
//import {getElement} from '../forms/formField';

export default class Form {
    constructor(element, callback) {
        this.element = element;
        this.callback = callback;

        this.errorElement = element.querySelector('.form__error');
        element.addEventListener('submit', this.onSubmit.bind(this), false);
    }

    getValue(element) {
        var property = (element.value === undefined) ? 'textContent' : 'value';
        return element[property].trim();
    }

    onSubmit(e) {
        e.preventDefault();
        this.submit();
    }

    submit() {
        var data = {};
        var fields = this.element.elements;

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            var id = field.id;

            if (id && !data[id]) {
                var value = this.getValue(field);
                if (!value && field.required) {
                    var label = field.previousElementSibling;
                    this.setError('We need your ' + label.textContent.toLocaleLowerCase());
                    field.focus();
                    return;
                }

                data[id] = value;
            }
        }

        this.callback(data);
    }

    // getData(fields) {
    //     for (var key in fields) {
    //         var name = fields[key];
    //         var field = getElement(this.element, name);
    //
    //         var value = field.value.trim();
    //         if (!value && field.required) {
    //             var label = field.previousElementSibling;
    //             this.setError('We need your ' + label.textContent.toLocaleLowerCase());
    //             field.focus();
    //             return;
    //         }
    //         else {
    //             fields[key] = value;
    //         }
    //     }
    //
    //     return fields;
    // }

    setError(message) {
        if (this.errorElement) {
            this.errorElement.textContent = message || '';
        }

        if (message) {
            animate(this.element, 'anim--shake');
        }
    }
}