import connection from '../firebase/connection';
import ProjectListItem from '../components/projectListItem';

export default class ProjectsPage {
    constructor(header) {
        this.header = header;
    }

    onRoute() {
        return connection.getAllProjects().then(function (projects) {
            this.header.update({title: 'Find a project'});

            this.element = document.createElement('div');
            this.element.className = 'projects';
            this.element.innerHTML = `
                <input type="search" placeholder="Search" aria-label="search" />
                <ul class="project-list"></ul>`;

            this.listItems = [];
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                if (project) {
                    var listItem = new ProjectListItem(projects[i]);
                    fragment.insertBefore(listItem.element, fragment.firstElementChild);
                    this.listItems.push(listItem);
                }
            }

            this.element.lastElementChild.appendChild(fragment);
            this.element.firstElementChild.addEventListener('input', this.onSearchChanged.bind(this), false);
        }.bind(this));
    }

    onSearchChanged(e) {
        var filterText = e.target.value;
        for (var i = 0; i < this.listItems.length; i++) {
            var listItem = this.listItems[i];
            var name = listItem.project.name || '';
            listItem.element.hidden = (filterText && name.indexOf(filterText) < 0);
        }
    }
}