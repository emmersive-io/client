var projects = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');

var template = require('../templates/allProjects.html');
var itemTemplate = require('../templates/projectItem.html');
var defaultProjectImage = require('../images/default.png');


function ProjectsPage(header) {
    header.update({title: 'Find a project'});
    this.element = renderTemplate(template);
    this.element.addEventListener('click', this.onProjectClick.bind(this), false);
    projects.getAll(this.renderProjects.bind(this));
}

ProjectsPage.prototype = {
    itemTemplateMap: {
        id: {prop: 'data-id'},
        description: '.project__description',
        image: {target: '.project__image', hideIfNull: true},
        name: '.project__title'
    },

    onProjectClick: function (e) {
        var element = e.target.closest('.project');
        var id = element && element.dataset.id;
        if (id) {
            location.assign('#projects/' + id);
        }
    },

    renderProjects: function (projects) {
        var projectList = document.createElement('ul');
        projectList.className = 'project-list';

        for (var id in projects) {
            var project = projects[id];
            projectList.appendChild(renderTemplate(itemTemplate, {
                id: id,
                name: project.name,
                description: project.description,
                image: project.image || defaultProjectImage
            }, this.itemTemplateMap));
        }

        this.element.appendChild(projectList);
    }
};

module.exports = ProjectsPage;