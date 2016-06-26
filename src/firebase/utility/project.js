var types = ['activities', 'meetups', 'people', 'tasks'];

function createProjectItem(session, projectId, type, data) {
    var itemData = Object.assign({
        created_at: session.serverTime,
        created_by: session.user.id
    }, data);

    var projectData = {};
    projectData.updated_at = session.serverTime;
    projectData['updated_' + type] = session.serverTime;
    session.root.child('projects/' + projectId).update(projectData);
    return session.root.child(type).child(projectId).push(itemData);
}

function projectHasUpdate(project, user) {
    var projectData = user.projects && user.projects[project.id];
    for (var i = 0; i < types.length; i++) {
        if (projectTypeHasUpdate(project, projectData, types[i])) {
            return true;
        }
    }

    return false;
}

function projectTypeHasUpdate(project, projectData, type) {
    var hasUpdate;
    if (projectData) {
        var lastView = projectData[type];
        var lastChange = project['updated_' + type];
        hasUpdate = lastChange && (!lastView || lastView < lastChange);
    }

    return hasUpdate || false;
}

function updateProjectParticipation(session, projectId, value) {
    return session.root.update({
        [`projects/${projectId}/people/${session.user.id}`]: value,
        [`projects/${projectId}/updated_at`]: session.serverTime,
        [`projects/${projectId}/updated_people`]: session.serverTime,
        [`users/${session.user.id}/projects/${projectId}`]: value && {joined: true}
    });
}

export {createProjectItem, projectHasUpdate, projectTypeHasUpdate, updateProjectParticipation};