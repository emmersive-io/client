var firebase = require('./connection');
var projectsRef = firebase.child('projects');
var user = require('./user');

module.exports = {
    get: function (projectId) {
        return projectsRef.child(projectId).once('value').then(function (snapshot) {
            var project = snapshot.val();
            return user.get(project.people).then(function (users) {
                project.people = users;
                return project;
            });
        });
    },

    getByUser: function (userId) {
        return user.get(userId).then(function (user) {
            if (user && user.projects) {
                var requests = [];
                Object.keys(user.projects).forEach(function (projectId) {
                    requests.push(projectsRef.child(projectId).once('value'));
                });

                return Promise.all(requests).then(function (array) {
                    return array.map(function (snapshot) {
                        var project = snapshot.val();
                        project.id = snapshot.key();
                        return project;
                    });
                });
            }
        })
    },

    getAll: function () {
        return projectsRef.orderByChild('created_at').once('value').then(function (snapshot) {
            return snapshot.val();
        });
    }
};