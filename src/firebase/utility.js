var types = ['activities', 'meetups', 'people', 'tasks'];

function projectHasUpdate(project, user) {
    for (var i = 0; i < types.length; i++) {
        if (projectTypeHasUpdate(project, user, types[i])) {
            return true;
        }
    }

    return false;
}

function projectTypeHasUpdate(project, user, type) {
    var userData = user.projects[project.id];
    if (userData) {
        var lastView = userData[type];
        var lastChange = project['updated_' + type];
        return lastChange && (!lastView || lastView < lastChange);
    }

    return false;
}


export {projectHasUpdate, projectTypeHasUpdate}