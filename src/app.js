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
    'projects/new': require('./pages/projectCreate'),
    'projects/:projectId': require('./pages/project'),
    'projects/:projectId/edit': require('./pages/projectEdit')
});
