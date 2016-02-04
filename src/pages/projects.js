var projects = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');

var template = require('../templates/allProjects.html');
var itemTemplate = require('../templates/projectItem.html');
var defaultProjectImage = require('../images/default.png');


function ProjectsPage(header) {
    header.update({title: 'Find a project'});
    this.element = renderTemplate(template);
    this.projects = [];

    this.element.addEventListener('click', this.onProjectClick.bind(this), false);
    this.element.addEventListener('input', this.onSearchChanged.bind(this), false);
    projects.getAll().then(this.getProjects.bind(this));
}

ProjectsPage.prototype = {
    itemTemplateMap: {
        id: {prop: 'data-id'},
        description: '.project__description',
        image: {target: '.project__image', hideIfNull: true},
        name: '.project__title'
    },

    getProjects: function (projects) {
        this.projects.length = 0;
        var fragment = document.createDocumentFragment();

        for (var id in projects) {
            var project = projects[id];
            var element = renderTemplate(itemTemplate, {
                id: id,
                name: project.name,
                description: project.description,
                image: project.image || defaultProjectImage
            }, this.itemTemplateMap);

            this.projects.push(Object.assign(project, {id: id, element: element}));
            fragment.appendChild(element);
        }

        this.element.querySelector('.project-list').appendChild(fragment);
    },

    onProjectClick: function (e) {
        var element = e.target.closest('.project-card');
        var id = element && element.dataset.id;
        if (id) {
            location.assign('#projects/' + id);
        }
    },

    onSearchChanged: function (e) {
        var filterText = e.target.value;

        for (var i = 0; i < this.projects.length; i++) {
            var project = this.projects[i];
            project.element.hidden = (filterText && project.name.indexOf(filterText) < 0);
        }
    }
};

module.exports = ProjectsPage;