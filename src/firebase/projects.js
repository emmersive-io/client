var Firebase = require('firebase');
var connection = require('./connection');

var auth = require('./auth');
var projectsRef = connection.child('projects');
var user = require('./user');

module.exports = {
    create: function () {
        var userId = auth.get().uid;
        var projectId = projectsRef.push().key();

        var data = {};
        data['users/' + userId + '/projects/' + projectId] = true;
        data['projects/' + projectId] = {
            created_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            people: [userId]
        };

        return connection.update(data).then(function () {
            return projectId;
        });
    },

    createActivity: function (projectId, content) {
        var userId = auth.get().uid;
        var ref = projectsRef.child(projectId).child('activities');

        return ref.push({
            created_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            description: content
        }).then(function (snapshot) {
            return ref.child(snapshot.key()).once('value').then(function (snapshot) {
                return snapshot.val();
            });
        });
    },

    createTask: function (projectId, content) {
        var userId = auth.get().uid;
        var projectTasksRef = projectsRef.child(projectId).child('tasks');

        return projectTasksRef.push({
            created_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            description: content,
            status: 'open'
        }).then(function (snapshot) {
            return projectTasksRef.child(snapshot.key()).once('value').then(function (snapshot) {
                return snapshot.val();
            });
        });
    },

    get: function (projectId) {
        return projectsRef.child(projectId).once('value').then(function (snapshot) {
            var project = snapshot.val();
            return user.getHash(project.people).then(function (users) {
                project.people = users;
                return project;
            });
        });
    },

    getAll: function () {
        return projectsRef.orderByChild('created_at').once('value').then(function (snapshot) {
            return snapshot.val();
        });
    },

    getByUser: function (userId) {
        var userProjectsRef = connection.child('users').child(userId).child('projects');
        return userProjectsRef.once('value').then(function (snapshot) {
            var projects = snapshot.val();
            var requests = Object.keys(projects).map(function (projectId) {
                return projectsRef.child(projectId).once('value');
            });

            return Promise.all(requests).then(function (array) {
                return array.map(function (snapshot) {
                    var project = snapshot.val();
                    project.id = snapshot.key();
                    return project;
                });
            });
        });
    },

    update: function (projectId, data) {
        return projectsRef.child(projectId).update(data);
    }
};