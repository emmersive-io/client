// This upgrades user.projects from a value of `true` to a value of `{joined: true}`

import firebase from '../src/firebase/ref';

export default function upgrade() {
    var ref = firebase.root.child('users');
    ref.on('value', function (snapshot) {
        var users = snapshot.val();

        for (var userId in users) {
            var user = users[userId];
            for (var projectId in user.projects) {
                var project = user.projects[projectId];
                if (project === true) {
                    user.projects[projectId] = {joined: true};
                }
            }
        }

        ref.set(users);
    });
}