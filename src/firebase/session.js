import firebase from 'firebase';
import getConfig from './components/config';

import activity from './components/activity';
import auth from './components/auth';
import profile from './components/profile';
import project from './components/project';
import tasks from './components/tasks';

import User from './components/user';
import UserCache from './components/userCache';


// This serves as the common entry point to all server side functionality
export default {
    init: function () {
        firebase.initializeApp(getConfig());

        // Alias common firebase references
        this.auth = firebase.auth();
        this.root = firebase.database().ref();
        this.storage = firebase.storage().ref();
        this.serverTime = firebase.database.ServerValue.TIMESTAMP;

        // Tack on functionality from other connection components
        this.user = new User(this);
        this.userCache = new UserCache(this);
        Object.assign(this, activity, auth, profile, project, tasks);
    }
}