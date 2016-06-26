import {createProjectItem} from '../utility/project';

export default {
    createActivity: function (projectId, content) {
        return createProjectItem(this, projectId, 'activities', {
            description: content,
            status: 'open'
        });
    }
}