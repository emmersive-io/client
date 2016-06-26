import {storeImage} from '../utility/storeImage';
import {toArray, toObj} from '../utility/transform';
import {updateProjectParticipation} from '../utility/project';


export default {
    createProject: function (projectData, file) {
        var userId = this.user.id;
        var projectId = this.root.child('projects').push().key;

        projectData = Object.assign({
            created_at: this.serverTime,
            updated_at: this.serverTime,
            created_by: userId,
            people: {[userId]: true}
        }, projectData);

        return this.root.update({
                [`projects/${projectId}`]: projectData,
                [`users/${userId}/projects/${projectId}`]: {joined: true}
            })
            .then(() => this.setProjectImage(projectId, file))
            .then(() => projectId);
    },

    getAllProjects: function () {
        return this.root.child('projects').orderByChild('updated_at').once('value').then(toArray);
    },

    getProject: function (projectId) {
        return this.root.child('projects/' + projectId).once('value').then(snapshot => {
            var project = toObj(snapshot);
            if (project) {
                return this.userCache.get(project.created_by).then(user => {
                    project.created_by = user;
                    return project;
                });
            }
        });
    },

    joinProject: function (projectId) {
        return updateProjectParticipation(this, projectId, true);
    },

    leaveProject: function (projectId) {
        return updateProjectParticipation(this, projectId, null);
    },

    removeProject: function (projectId) {
        var path = 'projects/' + projectId;
        return this.root.child(path).once('value').then(snapshot => {
            var project = snapshot.val();
            if (project) {
                var data = {
                    ['archive/' + path]: project,
                    [path]: null
                };

                for (var userId in project.people) {
                    data[`users/${userId}/projects/${projectId}`] = null;
                }

                return this.root.update(data);
            }
        });
    },

    setProjectImage: function (projectId, file) {
        if (file) {
            return storeImage(this, `projects/${projectId}/image`, file);
        }
    },

    updateProject: function (projectId, data) {
        return this.root.child('projects/' + projectId).update(Object.assign(data, {
            updated_at: this.serverTime
        }));
    },

    viewProject: function (projectId, type) {
        return this.root.child(`users/${this.user.id}/projects/${projectId}`).update({
            [type]: this.serverTime
        });
    }
};