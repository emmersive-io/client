import {createProjectItem} from '../utility/project';

export default {
    createTask: function (projectId, content) {
        return createProjectItem(this, projectId, 'tasks', {
            updated_at: this.serverTime,
            updated_by: this.user.id,
            description: content,
            status: 'open'
        });
    },

    removeTask: function (projectId, taskId) {
        var path = `tasks/${projectId}/${taskId}`;
        return this.root.child(path).once('value').then(snapshot => {
            var task = snapshot.val();
            if (task) {
                return this.root.update({
                    ['archive/' + path]: task,
                    [path]: null
                });
            }
        });
    },

    updateTask: function (projectId, taskId, taskData) {
        return Promise.all([
            this.root.child(`tasks/${projectId}/${taskId}`).update(Object.assign(taskData, {
                updated_at: this.serverTime,
                updated_by: this.user.id
            })),
            this.root.child(`projects/${projectId}`).update({
                updated_at: this.serverTime,
                updated_tasks: this.serverTime
            })
        ]);
    }
}