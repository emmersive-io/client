var characters = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function buildString(strings, values) {
    var result = '';
    for (var i = 0; i < strings.length; i++) {
        result += strings[i] + (values[i] || '');
    }

    return result;
}

function escapeHtml(string) {
    return string.replace(/[&<>"'`=\/]/g, s => characters[s]);
}

function ifDefined(strings, ...values) {
    if (values.every(x => x != null)) {
        return buildString(strings, values);
    }
}

function safeString(strings, ...values) {
    // Escape input text, unless its an svg icon definition
    return buildString(strings, values.map(x => x && x.indexOf('<svg') !== 0 ? escapeHtml(x) : x));
}

export {
    escapeHtml,
    ifDefined,
    safeString
};