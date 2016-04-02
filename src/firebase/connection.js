var Firebase = require('./firebase');
var session = require('./session');
var transform = require('./transform');

var serverTime = Firebase.ref.ServerValue.TIMESTAMP;
var connection = Firebase.get();


function createProjectItem(projectId, type, data) {
    var userId = session.user.id;
    var typeListRef = connection.child(type).child(projectId);

    data = Object.assign({
        created_at: serverTime,
        created_by: userId
    }, data);

    return typeListRef.push(data).then(function (snapshot) {
        var data = {};
        data.updated_at = serverTime;
        data['updated_' + type] = serverTime;
        connection.child('projects/' + projectId).update(data);

        return typeListRef.child(snapshot.key()).once('value').then(function (snapshot) {
            var obj = transform.toObj(snapshot);
            return transform.fillUserData(connection.child('users'), obj, 'created_by');
        });
    });
}

function updateProjectParticipation(projectId, value) {
    var data = {};
    var userId = session.user.id;
    data['users/' + userId + '/projects/' + projectId] = value && {joined: true};
    data['projects/' + projectId + '/people/' + userId] = value;
    data['projects/' + projectId + '/updated_at'] = serverTime;
    data['projects/' + projectId + '/updated_people'] = serverTime;
    return connection.update(data);
}


module.exports = {
    changeEmail: function (oldEmail, newEmail, password) {
        return connection.changeEmail({
            oldEmail: oldEmail,
            newEmail: newEmail,
            password: password
        });
    },

    changePassword: function (email, oldPassword, newPassword) {
        return connection.changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        });
    },

    createActivity: function (projectId, content) {
        return createProjectItem(projectId, 'activities', {
            description: content,
            status: 'open'
        });
    },

    createProject: function (projectData) {
        var userId = session.user.id;
        var projectId = connection.child('projects').push().key();

        var people = {};
        people[userId] = true;

        var data = {};
        data['users/' + userId + '/projects/' + projectId] = {joined: true};
        data['projects/' + projectId] = Object.assign({
            created_at: serverTime,
            updated_at: serverTime,
            created_by: userId,
            people: people
        }, projectData);

        return connection.update(data).then(function () {
            return projectId;
        });
    },

    createTask: function (projectId, content) {
        return createProjectItem(projectId, 'tasks', {
            description: content,
            status: 'open'
        });
    },

    createUser: function (name, email, password) {
        var credentials = {email: email, password: password};
        return connection.createUser(credentials).then(function (userData) {
            // Create a user entry
            return connection.child('users/' + userData.uid).set({
                provider: 'password',
                email: email,
                name: name
            });
        }).then(function () {
            // Automatically log the user in
            return session.login(email, password);
        });
    },

    getAllProjects: function () {
        return connection.child('projects').orderByChild('updated_at').once('value').then(transform.toArray);
    },

    getProject: function (projectId) {
        return connection.child('projects/' + projectId).once('value').then(function (snapshot) {
            var project = transform.toObj(snapshot);
            if (project) {
                return transform.fillUserData(connection.child('users'), project, 'created_by');
            }
        });
    },

    getProjectActivity: function (projectId) {
        return connection.child('activities/' + projectId).once('value').then(function (snapshot) {
            return transform.fillUserData(connection.child('users'), transform.toArray(snapshot), 'created_by');
        });
    },

    getProjectPeople: function (projectId) {
        return connection.child('projects/' + projectId + '/people').once('value').then(function (snapshot) {
            return transform.requestAsArray(connection.child('users'), snapshot);
        });
    },

    getProjectTasks: function (projectId) {
        return connection.child('tasks/' + projectId).once('value').then(function (snapshot) {
            return transform.fillUserData(connection.child('users'), transform.toArray(snapshot), 'created_by');
        });
    },

    getProjectsForUser: function () {
        var userId = session.user.id;
        return connection.child('users/' + userId + '/projects').once('value').then(function (snapshot) {
            return transform.requestAsArray(connection.child('projects'), snapshot);
        });
    },

    getUser: function (userId) {
        return connection.child('users/' + userId).once('value').then(transform.toObj);
    },

    joinProject: function (projectId) {
        return updateProjectParticipation(projectId, true);
    },

    leaveProject: function (projectId) {
        return updateProjectParticipation(projectId, null);
    },

    removeProject: function (projectId) {
        return connection.child('projects/' + projectId).once('value').then(function (snapshot) {
            var data = {};
            var project = snapshot.val();
            data['archive/projects/' + projectId] = project;
            data['projects/' + projectId] = null;

            for (var userId in project.people) {
                data['users/' + userId + '/projects/' + projectId] = null;
            }

            return connection.update(data);
        });
    },

    resetPassword: function (email) {
        return connection.resetPassword({email: email});
    },

    updateProject: function (projectId, data) {
        return connection.child('projects/' + projectId).update(Object.assign(data, {
            updated_at: serverTime
        }));
    },

    updateTask: function (projectId, taskId, taskData) {
        return Promise.all([
            connection.child('tasks/' + projectId + '/' + taskId).update(Object.assign(taskData, {
                updated_at: serverTime
            })),
            connection.child('projects/' + projectId).update({
                updated_at: serverTime,
                updated_tasks: serverTime
            })
        ]);
    },

    viewProject: function (projectId, type) {
        var data = {};
        var userId = session.user.id;
        data[type] = serverTime;
        return connection.child('users/' + userId + '/projects/' + projectId).update(data);
    }
};
