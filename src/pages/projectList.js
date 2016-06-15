import connection from '../firebase/connection';
import Project from '../elements/projectListItem';

export default class ProjectsPage {
    constructor(options) {
        analytics.page("project_list");
        this.header = options.header;
    }

    onRoute() {
        return connection.getAllProjects().then(function (projects) {
            this.header.update({title: 'Find a project'});

            this.element = document.createElement('div');
            this.element.className = 'projects scrollable';
            this.element.innerHTML = `
                <input class="input--full" type="search" placeholder="Search" aria-label="search" />
                <ul class="project-list"></ul>`;

            this.projects = [];
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < projects.length; i++) {
                var projectData = projects[i];
                if (projectData) {
                    var project = new Project(projects[i]);
                    fragment.insertBefore(project.element, fragment.firstElementChild);
                    this.projects.push(project);
                }
            }

            this.element.lastElementChild.appendChild(fragment);
            this.element.firstElementChild.addEventListener('input', this.onSearchChanged.bind(this), false);
        }.bind(this));
    }

    onSearchChanged(e) {
        var filterText = e.target.value.toLocaleLowerCase();
        for (var i = 0; i < this.projects.length; i++) {
            var project = this.projects[i];
            var name = (project.name || '').toLocaleLowerCase();
            project.element.hidden = filterText ? name.indexOf(filterText) < 0 : false;
        }
    }
}