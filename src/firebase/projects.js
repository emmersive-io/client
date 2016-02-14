var Firebase = require('firebase');
var connection = require('./connection');

var auth = require('./auth');
var projectsRef = connection.child('projects');
var userRef = connection.child('users');
var user = require('./user');

function getRequests(ref, keyHash) {
    var keys = keyHash ? Object.keys(keyHash) : [];
    return Promise.all(keys.map(function (key) {
        return ref.child(key).once('value');
    }));
}

function getAsHash(ref, keyHash) {
    return getRequests(ref, keyHash).then(function (array) {
        return array.reduce(function (obj, snapshot) {
            obj[snapshot.key()] = snapshot.val();
            return obj;
        }, {});
    });
}

function getAsArray(ref, keyHash) {
    return getRequests(ref, keyHash).then(function (array) {
        return array.map(function (snapshot) {
            var value = snapshot.val();
            if (value) {
                value.id = snapshot.key();
            }

            return value;
        });
    });
}

module.exports = {
    create: function (projectData) {
        var userId = auth.get().uid;
        var projectId = projectsRef.push().key();

        var project = Object.assign({
            created_at: Firebase.ServerValue.TIMESTAMP,
            updated_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            people: {}
        }, projectData);

        project.people[userId] = true;

        var data = {};
        data['users/' + userId + '/projects/' + projectId] = true;
        data['projects/' + projectId] = project;

        return connection.update(data).then(function () {
            return projectId;
        });
    },

    createActivity: function (projectId, content) {
        var userId = auth.get().uid;
        var activityRef = connection.child('activities').child(projectId);

        return activityRef.push({
            created_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            description: content
        }).then(function (snapshot) {
            var activityId = snapshot.key();
            var projectRef = projectsRef.child(projectId);

            return Promise.all([
                activityRef.child(activityId).once('value'),
                projectRef.child('activities').child(activityId).set(true),
                projectRef.child('updated_at').set(Firebase.ServerValue.TIMESTAMP)
            ]).then(function (snapshot) {
                return snapshot[0].val();
            });
        });
    },

    createTask: function (projectId, content) {
        var userId = auth.get().uid;
        var taskRef = connection.child('tasks').child(projectId);

        return taskRef.push({
            created_at: Firebase.ServerValue.TIMESTAMP,
            created_by: userId,
            description: content,
            status: 'open'
        }).then(function (snapshot) {
            var taskId = snapshot.key();
            var projectRef = projectsRef.child(projectId);

            return Promise.all([
                taskRef.child(snapshot.key()).once('value'),
                projectRef.child('tasks').child(taskId).set(true),
                projectRef.child('updated_at').set(Firebase.ServerValue.TIMESTAMP)
            ]).then(function (snapshot) {
                return snapshot[0].val();
            });
        });
    },

    get: function (projectId) {
        return projectsRef.child(projectId).once('value').then(function (snapshot) {
            var project = snapshot.val();
            if (project) {
                // Gathering all information for now, until the UI is updated
                var getActivity = getAsArray(connection.child('activities').child(projectId), project.activities);
                var getPeople = getAsHash(connection.child('users'), project.people);
                var getTasks = getAsArray(connection.child('tasks').child(projectId), project.tasks);

                return Promise.all([
                    getActivity.then(function (activities) { project.activities = activities; }),
                    getPeople.then(function (users) { project.people = users; }),
                    getTasks.then(function (tasks) { project.tasks = tasks; })
                ]).then(function () {
                    return project;
                });
            }
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
            if (projects) {
                var requests = Object.keys(projects).map(function (projectId) {
                    return projectsRef.child(projectId).once('value');
                });

                return Promise.all(requests).then(function (array) {
                    return array.map(function (snapshot) {
                        var project = snapshot.val() || {};
                        project.id = snapshot.key();
                        return project;
                    });
                });
            }
        });
    },

    joinProject: function (projectId) {
        var user = auth.get();
        return Promise.all([
            userRef.child(user.uid).child('projects').child(projectId).set(true),
            projectsRef.child(projectId).child('people').child(user.uid).set(true)
        ]);
    },

    leaveProject: function (projectId) {
        var user = auth.get();
        return Promise.all([
            userRef.child(user.uid).child('projects').child(projectId).remove(),
            projectsRef.child(projectId).child('people').child(user.uid).remove()
        ]);
    },

    removeProject: function (projectId) {
        return projectsRef.child(projectId).child('people').once('value').then(function (snapshot) {
            var requests = [projectsRef.child(projectId).remove()];
            var users = snapshot.val();
            for (var userId in users) {
                requests.push(userRef.child(userId).child('projects').child(projectId).remove());
            }

            return Promise.all(requests);
        });
    },

    update: function (projectId, data) {
        return projectsRef.child(projectId).update(Object.assign(data, {
            updated_at: Firebase.ServerValue.TIMESTAMP
        }));
    }
};