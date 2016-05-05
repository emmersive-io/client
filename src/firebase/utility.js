var types = ['activities', 'meetups', 'people', 'tasks'];

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

export {projectHasUpdate, projectTypeHasUpdate}