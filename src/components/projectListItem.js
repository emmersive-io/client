var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectItem.html');
var defaultProjectImage = require('../images/default.png');

module.exports = function (id, project) {
    this.project = project;
    this.element = renderTemplate(template, {
        id: id,
        name: project.name,
        description: project.description,
        image: project.image || defaultProjectImage
    }, {
        id: {prop: 'data-id'},
        name: '.project__title',
        description: '.project__description',
        image: {target: '.project__image', hideIfNull: true}
    });

    this.element.addEventListener('click', function () {
        location.assign('#projects/' + id);
    }, false);
};