import Form from '../forms/form';
import connection from '../firebase/connection';

export default class ProjectCreatePage {
    constructor({header, router}) {
        header.update({title: 'New Project', leftAction: 'back'});

        this.element = document.createElement('div');
        this.element.className = 'project-edit';
        this.element.innerHTML = `
            <form class="form--infield">
                <div class="form__body">
                    <div class="form__field">
                        <label for="name">Project Title</label>
                        <input id="name" type="text" placeholder="Untitled Project" autocomplete="off" required />
                    </div>
                    <div class="form__field">
                        <label for="description">Description</label>
                        <textarea id="description" placeholder="Add a short description" autocomplete="off"></textarea>
                    </div>
                </div>
                <p class="form__error"></p>
                <button class="button--full form__submit">Create</button>
            </form>`;

        var form = new Form(this.element.firstElementChild, function (data) {
            connection.createProject(data)
                .then((id) => router.navigateTo('#projects/' + id, {replace: true}))
                .catch((e) => form.setError(e.message));
        });
    }
}