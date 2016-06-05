import firebase from 'firebase';

export default {
    serverTime: firebase.database.ServerValue.TIMESTAMP,

    get root() {
        firebase.initializeApp(this.getConfig());
        delete this.root;
        
        this.auth = firebase.auth();
        this.root = firebase.database().ref();
        return this.root;
    },

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