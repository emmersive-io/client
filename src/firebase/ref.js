import firebase from 'firebase';

export default {
    serverTime: firebase.database.ServerValue.TIMESTAMP,

    init: function (property) {
        firebase.initializeApp({
            apiKey: 'AIzaSyDEamVmF67BIhbKFL23O_jgxjTSl1mtDNc',
            authDomain: 'project-1955571858363412928.firebaseapp.com',
            databaseURL: 'https://project-1955571858363412928.firebaseio.com',
            storageBucket: 'project-1955571858363412928.appspot.com'
        });

        delete this.auth;
        delete this.root;

        this.auth = firebase.auth();
        this.root = firebase.database().ref();
        return this[property];
    },

    get auth() { return this.init('auth'); },
    get root() { return this.init('root'); },

    getConfig(){
        var id;
        var hostname = location.hostname;

        if (hostname.indexOf('.emmersive.io') != -1) {
            id = 'flickering-inferno-1351';
        }
        else if (hostname.indexOf('.firebaseapp.com') != -1) {
            id = 'emmersive-stage';
        }
        else {
            id = 'emmersive-dev';
        }

        return {
            apiKey: 'apiKey',
            authDomain: id + '.firebaseapp.com',
            databaseURL: 'https://' + id + '.firebaseio.com'
        };
    }
}