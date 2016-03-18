var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectItem.handlebars');

module.exports = function (project) {
    this.project = project;
    this.element = renderTemplate(template(project));
    this.element.addEventListener('click', function () {
        location.assign('#projects/' + project.id);
    }, false);
};