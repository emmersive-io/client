import patterns from './inputPatterns';

export default {
    name: {
        label: 'Name',
        placeholder: 'John Q Doe'
    },
    prefix: {
        name: 'honorific-prefix',
        label: 'Prefix',
        placeholder: 'e.g. Mr, Mrs, Dr'
    },
    firstName: {
        name: 'given-name',
        label: 'First Name',
        placeholder: 'John'
    },
    middleName: {
        name: 'additional-name',
        label: 'Middle Name',
        placeholder: 'Quin'
    },
    lastName: {
        name: 'family-name',
        label: 'Last Name',
        placeholder: 'Doe'
    },
    suffix: {
        name: 'honorific-suffix',
        label: 'Suffix',
        placeholder: 'e.g. Jr, Sr'
    },
    organization: {
        label: 'Organization'
    },
    jobTitle: {
        name: 'organization-title',
        label: 'Job Title'
    },
    username: {
        label: 'Username',
        placeholder: 'johndoe23'
    },
    password: {
        name: 'current-password',
        label: 'Password',
        type: 'password',
        placeholder: 'At least 6 characters'
    },
    passwordNew: {
        name: 'new-password',
        label: 'Password',
        type: 'password',
        placeholder: 'At least 6 characters'
    },
    email: {
        type: 'email',
        label: 'Email Address',
        placeholder: 'someone@domain.com'
    },
    address: {
        name: 'street-address',
        label: 'Address',
        placeholder: '1000 East Avenue Apt #6'
    },
    address1: {
        name: 'address-line1',
        label: 'Address Line 1',
        placeholder: '1000 East Avenue'
    },
    address2: {
        name: 'address-line2',
        label: 'Address Line 2',
        placeholder: 'Apt #6'
    },
    address3: {
        name: 'address-line3',
        label: 'Address Line 3'
    },
    state: {
        name: 'address-level1',
        label: 'State'
    },
    city: {
        name: 'address-level2',
        label: 'City'
    },
    country: {
        name: 'country-name',
        label: 'Country'
    },
    zipCode: {
        name: 'postal-code',
        label: 'Zip Code',
        pattern: patterns.zipCode,
        placeholder: '12345'
    },
    cardName: {
        name: 'ccname',
        autocomplete: 'cc-name',
        label: 'Name on Card',
        placeholder: 'John Q Doe'
    },
    cardFirstName: {
        name: 'cc-given-name',
        label: 'First Name',
        placeholder: 'John'
    },
    cardMiddleName: {
        name: 'cc-additional-name',
        label: 'Middle Name',
        placeholder: 'Quin'
    },
    cardLastName: {
        name: 'cc-family-name',
        label: 'Last Name',
        placeholder: 'Doe'
    },
    cardNumber: {
        name: 'ccnumber',
        autocomplete: 'cc-number',
        label: 'Card Number',
        pattern: patterns.creditCard
    },
    cardExp: {
        name: 'expdate',
        autocomplete: 'cc-exp',
        type: 'month',
        label: 'Expiration Date',
        placeholder: 'MM/YYYY'
    },
    cardExpMonth: {
        name: 'cc-exp-month',
        type: 'number',
        label: 'Month'
    },
    cardExpYear: {
        name: 'cc-exp-year',
        type: 'number',
        label: 'Year'
    },
    cardCSC: {
        name: 'cc-csc',
        label: 'Security Code'
    },
    cardType: {
        name: 'cc-type',
        label: 'Type'
    },
    dob: {
        type: 'date',
        name: 'bday',
        label: 'Birthday',
        pattern: patterns.date
    },
    dobDay: {
        type: 'number',
        name: 'bday-day',
        label: 'Day'
    },
    dobMonth: {
        type: 'number',
        name: 'bday-month',
        label: 'Month'
    },
    dobYear: {
        type: 'number',
        name: 'bday-year',
        label: 'Year'
    },
    sex: {
        label: 'Sex'
    },
    website: {
        type: 'url',
        name: 'url',
        label: 'Website'
    },
    photo: {
        type: 'url',
        label: 'Image URL'
    },
    tel: {
        name: 'tel-national',
        label: 'Phone Number',
        pattern: patterns.phoneNumber,
        placeholder: '123-456-7890'
    },
    telExtension: {
        name: 'tel-extension',
        label: 'Extension'
    }
};