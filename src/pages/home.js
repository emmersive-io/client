import imagePath from '../images/no_projects.png';
import getIcon from '../elements/icon';

export default class HomePage {
    constructor(options) {
        analytics.page("home");
        
        options.header.update();

        this.element = document.createElement('div');
        this.element.className = 'home form-page scrollable';
        this.element.innerHTML = `
        <div class="form-page__form">
            <img class="profile__image" src="${imagePath}"/>
            <button class="button--full" data-href="#projects/new">
                ${getIcon('plus')} Create a project
            </button>
            <button class="button--full" data-href="#projects">
                ${getIcon('search')} Find a project
            </button>
        </div>`;
    }
}