var Firebase = require('firebase');
//var connection = new Firebase("https://flickering-inferno-1351.firebaseio.com");
var connection = loadConnection();

var transform = require('./transform');

function loadConnection(){
    var env = getEnv();
    var origin = 'emmersive-dev';
    switch(env) {
    case 'prod':
	origin = 'flickering-inferno-1351';
	break;
    case 'staging':
	origin = 'emmersive-stage'
	break;

    }
    console.log(origin);
    return new Firebase('https://'+origin+'.firebaseio.com');
}

function getEnv(){
    var loc = window.location.hostname
    if (loc.search('.emmersive.io') != -1){
	return 'prod';
    } else if (loc.search('.firebaseapp.com') != -1){
	return 'staging';
    } else {
	return 'dev';
    }

}

function createProjectItem(projectId, type, data) {
    var userId = connection.getAuth().uid;
    var typeListRef = connection.child(type).child(projectId);

    data = Object.assign({
        created_at: Firebase.ServerValue.TIMESTAMP,
        created_by: userId
    }, data);

    return typeListRef.push(data).then(function (snapshot) {
        var data = {};
        data.updated_at = Firebase.ServerValue.TIMESTAMP;
        data['updated_' + type] = Firebase.ServerValue.TIMESTAMP;
        connection.child('projects/' + projectId).update(data);

        return typeListRef.child(snapshot.key()).once('value').then(function (snapshot) {
            var obj = transform.toObj(snapshot);
            return transform.fillUserData(connection.child('users'), obj, 'created_by');
        });
    });
}

function updateProjectParticipation(projectId, value) {
    var data = {};
    var userId = connection.getAuth().uid;
    data['users/' + userId + '/projects/' + projectId] = value && {joined: true};
    data['projects/' + projectId + '/people/' + userId] = value;
    data['projects/' + projectId + '/updated_at'] = Firebase.ServerValue.TIMESTAMP;
    data['projects/' + projectId + '/updated_people'] = Firebase.ServerValue.TIMESTAMP;
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
        var userId = connection.getAuth().uid;
        var projectId = connection.child('projects').push().key();

        var people = {};
        people[userId] = true;

        var data = {};
        data['users/' + userId + '/projects/' + projectId] = {joined: true};
        data['projects/' + projectId] = Object.assign({
            created_at: Firebase.ServerValue.TIMESTAMP,
            updated_at: Firebase.ServerValue.TIMESTAMP,
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
            connection.child('users/' + userData.uid).set({
                provider: 'password',
                email: email,
                name: name
            });

            // Automatically log the user in
            return this.login(email, password);
        }.bind(this));
    },

    getAuth: function () {
        return connection.getAuth();
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
        var userId = connection.getAuth().uid;
        return connection.child('users/' + userId + '/projects').once('value').then(function (snapshot) {
            return transform.requestAsArray(connection.child('projects'), snapshot);
        });
    },

    getUser: function (userId) {
        return connection.child('users/' + userId).once('value').then(transform.toObj);
    },

    isLoggedIn: function () {
        return connection.getAuth() ? true : false;
    },

    joinProject: function (projectId) {
        return updateProjectParticipation(projectId, true);
    },

    leaveProject: function (projectId) {
        return updateProjectParticipation(projectId, null);
    },

    login: function (email, password) {
        return connection.authWithPassword({email: email, password: password});
    },

    logOut: function () {
        connection.unauth();
    },

    onLoggedOut: function (callback) {
        connection.onAuth(function (authData) {
            if (!authData) {
                callback();
            }
        });
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
            updated_at: Firebase.ServerValue.TIMESTAMP
        }));
    },

    updateTask: function (projectId, taskId, taskData) {
        return Promise.all([
            connection.child('tasks/' + projectId + '/' + taskId).update(Object.assign(taskData, {
                'updated_at': Firebase.ServerValue.TIMESTAMP
            })),
            connection.child('projects/' + projectId).update({
                'updated_at': Firebase.ServerValue.TIMESTAMP,
                'updated_tasks': Firebase.ServerValue.TIMESTAMP
            })
        ]);
    },

    viewProject: function (projectId, type) {
        var data = {};
        var userId = connection.getAuth().uid;
        data[type] = Firebase.ServerValue.TIMESTAMP;
        return connection.child('users/' + userId + '/projects/' + projectId).update(data);
    }
};
