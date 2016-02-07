var projects = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');

var template = require('../templates/allProjects.html');
var ProjectListItem = require('../components/projectListItem');


function ProjectsPage(header) {
    header.update({title: 'Find a project'});
    this.element = renderTemplate(template);
    this.listItems = [];

    this.element.addEventListener('input', this.onSearchChanged.bind(this), false);
    projects.getAll().then(this.getProjects.bind(this));
}

ProjectsPage.prototype = {
    getProjects: function (projects) {
        var fragment = document.createDocumentFragment();
        for (var id in projects) {
            var listItem = new ProjectListItem(id, projects[id]);
            this.listItems.push(listItem);
            fragment.appendChild(listItem.element);
        }

        this.element.querySelector('.project-list').appendChild(fragment);
    },

    onSearchChanged: function (e) {
        var filterText = e.target.value;
        for (var i = 0; i < this.listItems.length; i++) {
            var listItem = this.listItems[i];
            listItem.element.hidden = (filterText && listItem.project.name.indexOf(filterText) < 0);
        }
    }
};

module.exports = ProjectsPage;