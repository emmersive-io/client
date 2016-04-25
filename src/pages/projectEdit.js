import connection from '../firebase/connection';

export default class ProjectEditPage {
    constructor(header) {
        this.header = header;
    }

    onBlur(e) {
        var field = e.target.name;
        if (field) {
            connection.updateProject(this.project.id, {
                [field]: e.target.value.trim()
            });
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
                <input name="name" type="text" placeholder="Untitled Project" aria-label="project name" value="${project.name}"/>
                <textarea name="description" placeholder="Add a short description">${project.description}</textarea>
                <button class="button--full">Delete Project</button>`;

            this.nameInput = this.element.firstElementChild;
            this.descriptionInput = this.nameInput.nextElementSibling;
            this.element.addEventListener('blur', this.onBlur.bind(this), true);
            this.element.lastElementChild.addEventListener('click', this.onButtonClick.bind(this), false);
        }.bind(this));
    }
}