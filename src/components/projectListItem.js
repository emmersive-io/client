export default function (project) {
    this.project = project;

    this.element = document.createElement('li');
    this.element.setAttribute('data-href', '#projects/' + project.id);
    this.element.className = 'project-card';

    this.element.innerHTML = `
        <div class="project__content">
            <h2 class="project__title">${project.name}</h2>
            <p class="project__description">${project.description}</p>
        </div>`;


};