var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectItem.handlebars');
var defaultProjectImage = require('../images/default.png');

module.exports = function (project) {
    if (!project.image) {
        project.image = defaultProjectImage;
    }

    this.project = project;
    this.element = renderTemplate(template(project));
    this.element.addEventListener('click', function () {
        location.assign('#projects/' + project.id);
    }, false);
};