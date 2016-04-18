export default class BasementListItem {
    constructor(project) {
        this.project = project;
        this.element = document.createElement('li');
        this.element.className = 'basement__project';
        this.element.innerHTML = `<a href="#projects/${project.id}">${project.name}</a>`;
    }

    get name() {
        return this.project.name;
    }

    set name(value) {
        if (this.project.name !== value) {
            this.project.name = value;
            this.element.firstElementChild.textContent = value || 'Untitled';
        }
    }
}