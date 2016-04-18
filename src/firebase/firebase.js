import Firebase from 'firebase';

export default {
    ref: Firebase,

    get: function () {
        return this.connection || (this.connection = new Firebase(this.getURL()));
    },

    getURL: function () {
        var origin;
        var hostname = location.hostname;

        if (hostname.search('.emmersive.io') != -1) {
            origin = 'flickering-inferno-1351';
        }
        else if (hostname.search('.firebaseapp.com') != -1) {
            origin = 'emmersive-stage';
        }
        else {
            origin = 'emmersive-dev';
        }

        return 'https://' + origin + '.firebaseio.com';
    }
};
