'use strict';

require("./styles.css");
require('./core/polyfills');
require('./site/cordova');
require('./core/platform');

var Site = require('./site/site');
new Site({
    '': require('./pages/home'),

    'login': require('./pages/login'),
    'login/register': require('./pages/register'),
    'login/forgot-password': require('./pages/resetPassword'),
    'profile/:userId': require('./pages/profile'),

    'projects': require('./pages/projectList'),
    'projects/:projectId': require('./pages/project'),
    'projects/:projectId/activity': require('./pages/projectActivity'),
    'projects/:projectId/people': require('./pages/projectPeople'),
    'projects/:projectId/tasks': require('./pages/projectTasks'),

    'projects/:projectId/tasks/:taskId': require('./pages/task')
});
