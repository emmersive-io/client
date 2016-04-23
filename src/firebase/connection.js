import Firebase from './firebase';
import session from './session';
import transform from './transform';
import userCache from './userCache';

var serverTime = Firebase.ref.ServerValue.TIMESTAMP;
var connection = Firebase.get();


function createProjectItem(projectId, type, data) {
    var itemData = Object.assign({
        created_at: serverTime,
        created_by: session.user.id
    }, data);

    var projectData = {};
    projectData.updated_at = serverTime;
    projectData['updated_' + type] = serverTime;
    connection.child('projects/' + projectId).update(projectData);
    return connection.child(type).child(projectId).push(itemData);
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


export default {
    firebase: connection,

    createActivity: function (projectId, content) {
        return createProjectItem(projectId, 'activities', {
            description: content,
            status: 'open'
        });
    },

    createProject: function (projectData) {
        var userId = session.user.id;
        var projectId = connection.child('projects').push().key();

        projectData = Object.assign({
            created_at: serverTime,
            updated_at: serverTime,
            created_by: userId,
            people: {[userId]: true}
        }, projectData);

        return connection.update({
            ['projects/' + projectId]: projectData,
            ['users/' + userId + '/projects/' + projectId]: {joined: true}
        }).then(function () { return projectId; });
    },

    createTask: function (projectId, content) {
        return createProjectItem(projectId, 'tasks', {
            updated_at: serverTime,
            updated_by: session.user.id,
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
                return userCache.get(project.created_by).then(function (user) {
                    project.created_by = user;
                    return project;
                });
            }
        });
    },

    getUser: function (userId) {
        return userCache.get(userId);
    },

    joinProject: function (projectId) {
        return updateProjectParticipation(projectId, true);
    },

    leaveProject: function (projectId) {
        return updateProjectParticipation(projectId, null);
    },

    removeTask: function (projectId, taskId) {
        var path = 'tasks/' + projectId + '/' + taskId;
        return connection.child(path).once('value').then(function (snapshot) {
            var task = snapshot.val();
            if (task) {
                return connection.update({
                    ['archive/' + path]: task,
                    [path]: null
                });
            }
        });
    },

    removeProject: function (projectId) {
        var path = 'projects/' + projectId;
        return connection.child(path).once('value').then(function (snapshot) {
            var project = snapshot.val();
            if (project) {
                var data = {
                    ['archive/' + path]: project,
                    [path]: null
                };

                for (var userId in project.people) {
                    data['users/' + userId + '/projects/' + projectId] = null;
                }

                return connection.update(data);
            }
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
                updated_at: serverTime,
                updated_by: session.user.id
            })),
            connection.child('projects/' + projectId).update({
                updated_at: serverTime,
                updated_tasks: serverTime
            })
        ]);
    },

    updateUser: function (data) {
        connection.child('users/' + session.user.id).update(data);
    },

    viewProject: function (projectId, type) {
        var userId = session.user.id;
        return connection.child('users/' + userId + '/projects/' + projectId).update({
            [type]: serverTime
        });
    }
};
