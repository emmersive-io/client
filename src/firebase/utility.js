var types = ['activities', 'meetups', 'people', 'tasks'];

function projectHasUpdate(project, user) {
    for (var i = 0; i < types.length; i++) {
        if (projectTypeHasUpdate(project, user.projects, types[i])) {
            return true;
        }
    }

    return false;
}

function projectTypeHasUpdate(project, userProjects, type) {
    var projectData = userProjects && userProjects[project.id];
    if (projectData) {
        var lastView = projectData[type];
        var lastChange = project['updated_' + type];
        return lastChange && (!lastView || lastView < lastChange);
    }

    return false;
}

export {projectHasUpdate, projectTypeHasUpdate}