import animate from '../core/animate';
import connection from '../firebase/connection';

export default class ProjectCreatePage {
    constructor(header) {
        this.header = header;
        header.update({title: 'Create Project', leftAction: 'back'});

        this.element = document.createElement('div');
        this.element.className = 'project-edit';
        this.element.innerHTML = `
            <input class="project__name" type="text" placeholder="Untitled Project" aria-label="project name" />
            <textarea class="project__description" placeholder="Add a short description"></textarea>
            <button class="button--full">Create Project</button>`;

        this.nameInput = this.element.firstElementChild;
        this.descriptionInput = this.nameInput.nextElementSibling;
        this.element.lastElementChild.addEventListener('click', this.onButtonClick.bind(this));
    }

    onButtonClick() {
        var project = {
            name: this.nameInput.value.trim(),
            description: this.descriptionInput.value.trim()
        };

        connection.createProject(project).then(function (projectId) {
            location.replace('#projects/' + projectId);
        }).catch(function () {
            animate(button, 'anim--shake');
        });
    }
}