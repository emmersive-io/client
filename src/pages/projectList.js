var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/allProjects.html');
var ProjectListItem = require('../components/projectListItem');


function ProjectsPage(header) {
    this.header = header;
}

ProjectsPage.prototype.onRoute = function () {
    return connection.getAllProjects().then(function (projects) {
        this.header.update({title: 'Find a project'});
        this.element = renderTemplate(template);
        this.element.addEventListener('input', this.onSearchChanged.bind(this), false);

        this.listItems = [];
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < projects.length; i++) {
            var listItem = new ProjectListItem(projects[i]);
            fragment.insertBefore(listItem.element, fragment.firstElementChild);
            this.listItems.push(listItem);
        }

        this.element.querySelector('.project-list').appendChild(fragment);
    }.bind(this));
};

ProjectsPage.prototype.onSearchChanged = function (e) {
    var filterText = e.target.value;
    for (var i = 0; i < this.listItems.length; i++) {
        var listItem = this.listItems[i];
        var name = listItem.project.name || '';
        listItem.element.hidden = (filterText && name.indexOf(filterText) < 0);
    }
};

module.exports = ProjectsPage;