import animate from '../core/animate';
import connection from '../firebase/connection';

export default class ProjectCreatePage {
    constructor(options) {
        this.router = options.router;
        this.header = options.header;
        this.header.update({title: 'New Project', leftAction: 'back'});

        this.element = document.createElement('div');
        this.element.className = 'project-edit';
        this.element.innerHTML = `
            <input type="text" placeholder="Untitled Project" aria-label="project name" />
            <textarea placeholder="Add a short description"></textarea>
            <button class="button--full">Create</button>`;

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
            this.router.navigateTo('#projects/' + projectId);
        }).catch(function () {
            animate(button, 'anim--shake');
        });
    }
}