import imagePath from '../images/no_projects.png';

export default class HomePage {
    constructor(options) {
        options.header.update();

        this.element = document.createElement('div');
        this.element.className = 'home form-page scrollable';
        this.element.innerHTML = `
        <div class="form-page__form">
            <img class="profile__image" src="${imagePath}"/>
            <button class="button--full" data-href="#projects/new">
                <span class="fa fa-plus" aria-hidden="true"></span> Create a project
            </button>
            <button class="button--full" data-href="#projects">
                <span class="fa fa-search" aria-hidden="true"></span> Find a project
            </button>
        </div>`;
    }
}