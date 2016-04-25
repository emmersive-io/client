export default class ProjectMeetups {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'project__meetups scrollable';
        this.element.innerHTML = `<div class="zero-state--center">Coming soon</div>`;
    }

    remove() { }
}