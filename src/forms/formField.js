import inputProperties from './inputProperties';

function getElement(form, type) {
    var data = inputProperties[type];
    return data && form.elements[data.name || type];
}

function getInputData(options) {
    if (typeof options === 'string') {
        options = {type: options};
    }

    var data = inputProperties[options.type];
    if (data) {
        var name = data.name || options.type;
        return {
            autocomplete: data.autocomplete || name,
            id: options.id || options.type,
            isRequired: options.isRequired !== false,
            label: options.label || data.label,
            name: name,
            pattern: options.pattern || data.pattern,
            placeholder: options.placeholder || data.placeholder,
            type: data.type || 'text'
        };
    }
}

function getFormField(options) {
    return renderFormGroup(getInputData(options));
}

function renderFormGroup(data) {
    return data && `
        <div class="form__field ${data.isRequired ? '' : 'form__group--optional'}">
            <label for="${data.id}">${data.label}</label>
            <input id="${data.id}"
                   name="${data.name}" 
                   type="${data.type}"
                   autocomplete="${data.autocomplete}" 
                   ${data.isRequired ? 'required' : ''}
                   ${(data.pattern && `pattern="${data.pattern}"`) || ''}
                   ${(data.placeholder && `placeholder="${data.placeholder}"`) || ''} />
        </div>`;
}

export {
    getElement,
    getInputData,
    getFormField,
    renderFormGroup
};