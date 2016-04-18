import connection from '../firebase/connection';

export default class ProjectEditPage {
    constructor(header) {
        this.header = header;
    }

    onBlur(e) {
        var field;
        if (e.target.classList.contains('project__name')) {
            field = 'name';
        }
        else if (e.target.classList.contains('project__description')) {
            field = 'description';
        }

        if (field) {
            var projectData = {};
            projectData[field] = e.target.value.trim();
            connection.updateProject(this.project.id, projectData);
        }
    }

    onButtonClick() {
        if (confirm('Are you sure you want to delete the project?')) {
            connection.removeProject(this.project.id).then(function () {
                location.assign('#projects')
            });
        }
    }

    onRoute(root, projectId) {
        return connection.getProject(projectId).then(function (project) {
            this.project = project;
            this.header.update({title: 'Edit Project', leftAction: 'back'});

            this.element = document.createElement('div');
            this.element.className = 'project-edit';
            this.element.innerHTML = `
                <input class="project__name" type="text" placeholder="Untitled Project" aria-label="project name" value="${project.name}"/>
                <textarea class="project__description" placeholder="Add a short description">${project.description}</textarea>
                <button class="button--full">Delete Project</button>`;

            this.element.addEventListener('blur', this.onBlur.bind(this), true);
            this.element.lastElementChild.addEventListener('click', this.onButtonClick.bind(this), false);
        }.bind(this));
    }
}