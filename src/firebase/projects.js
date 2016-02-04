var firebase = require('./connection');
var users = require('./user');
var projectsRef = firebase.child('projects');

module.exports = {
    get: function (projectId) {
        return projectsRef.child(projectId).once('value').then(function (snapshot) {
            var project = snapshot.val();
            return users.get(project.people).then(function (users) {
                project.people = users;
                return project;
            });
        });
    },

    getAll: function () {
        return projectsRef.orderByChild('created_at').once('value').then(function (snapshot) {
            return snapshot.val();
        });
    }
};