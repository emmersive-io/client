import firebase from './ref';
import session from './session';
import transform from './transform';
import userCache from './userCache';


function createProjectItem(projectId, type, data) {
    var itemData = Object.assign({
        created_at: serverTime,
        created_by: session.user.id
    }, data);

    var projectData = {};
    projectData.updated_at = serverTime;
    projectData['updated_' + type] = serverTime;
    firebase.root.child('projects/' + projectId).update(projectData);
    return firebase.root.child(type).child(projectId).push(itemData);
}

function updateProjectParticipation(projectId, value) {
    var data = {};
    var userId = session.user.id;
    data['users/' + userId + '/projects/' + projectId] = value && {joined: true};
    data['projects/' + projectId + '/people/' + userId] = value;
    data['projects/' + projectId + '/updated_at'] = serverTime;
    data['projects/' + projectId + '/updated_people'] = serverTime;
    return firebase.root.update(data);
}


export default {
    createActivity: function (projectId, content) {
        return createProjectItem(projectId, 'activities', {
            description: content,
            status: 'open'
        });
    },

    createProject: function (projectData) {
        var userId = session.user.id;
        var projectId = firebase.root.child('projects').push().key;

        projectData = Object.assign({
            created_at: firebase.serverTime,
            updated_at: firebase.serverTime,
            created_by: userId,
            people: {[userId]: true}
        }, projectData);

        return firebase.root.update({
            ['projects/' + projectId]: projectData,
            ['users/' + userId + '/projects/' + projectId]: {joined: true}
        }).then(function () { return projectId; });
    },

    createTask: function (projectId, content) {
        return createProjectItem(projectId, 'tasks', {
            updated_at: firebase.serverTime,
            updated_by: session.user.id,
            description: content,
            status: 'open'
        });
    },

    createUser: function (name, email, password) {
        var credentials = {email: email, password: password};
        return firebase.root.createUser(credentials).then(function (userData) {
            // Create a user entry
            return firebase.root.child('users/' + userData.uid).set({
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
        return firebase.root.child('projects').orderByChild('updated_at').once('value').then(transform.toArray);
    },

    getProject: function (projectId) {
        return firebase.root.child('projects/' + projectId).once('value').then(function (snapshot) {
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
        return firebase.root.child(path).once('value').then(function (snapshot) {
            var task = snapshot.val();
            if (task) {
                return firebase.root.update({
                    ['archive/' + path]: task,
                    [path]: null
                });
            }
        });
    },

    removeProject: function (projectId) {
        var path = 'projects/' + projectId;
        return firebase.root.child(path).once('value').then(function (snapshot) {
            var project = snapshot.val();
            if (project) {
                var data = {
                    ['archive/' + path]: project,
                    [path]: null
                };

                for (var userId in project.people) {
                    data['users/' + userId + '/projects/' + projectId] = null;
                }

                return firebase.root.update(data);
            }
        });
    },

    resetPassword: function (email) {
        return firebase.root.resetPassword({email: email});
    },

    updateProject: function (projectId, data) {
        return firebase.root.child('projects/' + projectId).update(Object.assign(data, {
            updated_at: firebase.serverTime
        }));
    },

    updateTask: function (projectId, taskId, taskData) {
        return Promise.all([
            firebase.root.child('tasks/' + projectId + '/' + taskId).update(Object.assign(taskData, {
                updated_at: firebase.serverTime,
                updated_by: session.user.id
            })),
            firebase.root.child('projects/' + projectId).update({
                updated_at: firebase.serverTime,
                updated_tasks: firebase.serverTime
            })
        ]);
    },

    updateUser: function (data) {
        firebase.root.child('users/' + session.user.id).update(data);
    },

    viewProject: function (projectId, type) {
        var userId = session.user.id;
        return firebase.root.child('users/' + userId + '/projects/' + projectId).update({
            [type]: firebase.serverTime
        });
    }
};
