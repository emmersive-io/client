import connection from '../firebase/connection';
import ImageUpload from '../elements/imageUpload';

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

    onDeleteClick() {
        if (confirm('Are you sure you want to delete the project?')) {
            connection.removeProject(this.project.id)
                .then(() => this.router.navigateTo('#projects', {replace: true}));
        }
    }

    onRoute(projectId) {
        return connection.getProject(projectId).then(function (project) {
            this.header.update({
                title: 'Edit Project',
                leftAction: 'back',
                action: 'Delete',
                onAction: this.onDeleteClick.bind(this)
            });

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
            </div>`;

        var options = {className: 'project__image', src: this.project.image};
        var imageUpload = new ImageUpload(options, (file, metadata) => {
            connection.setProjectImage(this.project.id, file, metadata)
                .then(url => imageUpload.setImage(url))
        });

        this.element.insertBefore(imageUpload.element, this.element.firstElementChild);
        this.element.addEventListener('blur', this.onBlur.bind(this), true);
    }
}