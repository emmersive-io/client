import connection from '../firebase/connection';

export default class ProjectEditPage {
    constructor({header, router}) {
        analytics.page("project_edit");
        this.header = header;
        this.router = router;
    }

    onBlur(e) {
        var property = e.target.id;
        if (property) {
            connection.updateProject(this.project.id, {
                [property]: e.target.value.trim()
            });
        }
    }

    onButtonClick() {
        if (confirm('Are you sure you want to delete the project?')) {
            connection.removeProject(this.project.id)
                .then(() => this.router.navigateTo('#projects', {replace: true}));
        }
    }

    onRoute(projectId) {
        return connection.getProject(projectId).then(function (project) {
            this.header.update({title: 'Edit Project', leftAction: 'back'});
            this.project = project;
            this.render();
        }.bind(this));
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'project-edit';
        this.element.innerHTML = `
            <div class="form--infield">
                <div class="form__body">
                    <div class="form__field">
                        <label for="name" class="is-active">Project Title</label>
                        <input id="name" type="text" placeholder="Untitled Project" autocomplete="off" value="${this.project.name}" />
                    </div>
                    <div class="form__field">
                        <label for="description" class="is-active">Description</label>
                        <textarea id="description" placeholder="Add a short description">${this.project.description}</textarea>
                    </div>           
                </div>
                <button class="button--full form__submit">Delete Project</button>    
            </div>`;

        this.element.addEventListener('blur', this.onBlur.bind(this), true);
        this.element.querySelector('.form__submit').addEventListener('click', this.onButtonClick.bind(this), false);
    }
}