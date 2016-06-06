export default {
    creditCard: '[0-9]{13,16}',
    csc: '[0-9]{3,4}',
    date: '(?:(?:0[1-9]|1[0-2])[\/\\-. ]?(?:0[1-9]|[12][0-9])|(?:(?:0[13-9]|1[0-2])[\/\\-. ]?30)|(?:(?:0[13578]|1[02])[\/\\-. ]?31))[\/\\-. ]?(?:19|20)[0-9]{2}',
    phoneNumber: '\d{3}[\-]\d{3}[\-]\d{4}',
    zipCode: '(\d{5}([\-]\d{4})?)'
};