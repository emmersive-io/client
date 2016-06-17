export default class ProjectListItem {
    constructor(project) {
        this.project = project;
        this.element = document.createElement('li');
        this.element.setAttribute('data-href', '#projects/' + project.id);
        this.element.className = 'project-card';

        this.element.innerHTML = `
            <div class="project__content">
                <img class="project__image" src="${project.image || ''}"/>
                <h2 class="project__title">${project.name || 'Untitled'}</h2>
                <p class="project__description">${project.description || ''}</p>
            </div>`;
    }

    get name() {
        return this.project.name;
    }
}