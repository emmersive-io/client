export default function getConfig() {
    var apiKey, domain;
    var hostname = location.hostname;

    if (hostname.indexOf('.emmersive.io') != -1) {
        // TODO: Connect the imported prod instead of the temp one
        apiKey = 'AIzaSyDEamVmF67BIhbKFL23O_jgxjTSl1mtDNc';
        domain = 'project-1955571858363412928';
    }
    else if (hostname.indexOf('.firebaseapp.com') != -1) {
        apiKey = 'AIzaSyD2rFAQ1bZ0aDUk9A2TOM4BGW-Z0_JlxDc';
        domain = 'emmersive-stage';
    }
    else {
        apiKey = 'AIzaSyA2PYSUX1UghQS0PQp38DZ73cz6FQnr4mo';
        domain = 'emmersive-dev';
    }

    return {
        apiKey: apiKey,
        authDomain: `${domain}.firebaseapp.com`,
        databaseURL: `https://${domain}.firebaseio.com`,
        storageBucket: `${domain}.appspot.com`
    };
}