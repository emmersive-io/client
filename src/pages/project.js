import connection from '../firebase/connection';
import session from '../firebase/session';
import transform from '../firebase/transform';
import {projectTypeHasUpdate} from '../firebase/utility';

import ActivityPage from  '../project/activity';
import HomePage from '../project/home';
import MeetupPage from '../project/meetups';
import TaskPage from '../project/tasks';


export default class ProjectPage {
    constructor(header) {
        this.header = header;
        this.sections = [
            {type: HomePage},
            {name: 'activities', type: ActivityPage},
            {name: 'tasks', type: TaskPage},
            {name: 'meetups', type: MeetupPage}
        ];
    }

    initialize(projectId) {
        this.element = document.createElement('div');
        this.element.className = 'project';
        this.element.innerHTML = `
            <footer class="footer">
                <button data-href="#projects/${projectId}">
                    <span class="fa fa-briefcase" aria-hidden="true"></span>
                    <span class="button__title">Project</span>
                </button>
                <button data-href="#projects/${projectId}/activities">
                    <span class="fa fa-comment" aria-hidden="true"></span>
                    <span class="button__title">Discuss</span>
                </button>
                <button data-href="#projects/${projectId}/tasks">
                    <span class="fa fa-tasks" aria-hidden="true"></span>
                    <span class="button__title">Tasks</span>
                </button>
                <button data-href="#projects/${projectId}/meetups">
                    <span class="fa fa-calendar-check-o" aria-hidden="true"></span>
                    <span class="button__title">Meet up</span>
                </button>
            </footer>`;

        this.footer = this.element.lastElementChild;
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].button = this.footer.children[i];
        }

        this.projectRef = connection.firebase.child('projects/' + projectId);
        this.userProjectRef = connection.firebase.child('users/' + session.user.id + '/projects/' + projectId);

        this.projectRef.on('value', this.onProjectChanged, this);
        this.userProjectRef.on('value', this.onUserProjectUpdated, this);
    }

    onRemove() {
        this.projectRef.off('value', this.onProjectChanged, this);
        this.userProjectRef.off('value', this.onUserProjectUpdated, this);

        for (var i = 0; i < this.sections.length; i++) {
            var section = this.sections[i];
            if (section.content) {
                section.content.remove();
            }
        }
    }

    onRoute(root, projectId, section) {
        if (!this.element) {
            this.initialize(projectId);
        }

        this.setSelectedSection(section);
    }

    setSelectedSection(sectionName) {
        if (this.section) {
            this.section.content.element.remove();
            this.section.button.classList.remove('selected');
            connection.viewProject(this.project.id, this.section.name || 'people');
        }

        this.section = this.sections.find(section => section.name === sectionName)
                       || this.sections[0];

        this.section.button.classList.add('selected');
        this.setSectionElement();
    }

    setSectionElement() {
        if (this.project) {
            if (!this.section.content) {
                this.section.content = new this.section.type(this.project);
            }

            var element = this.section.content.element;
            if (!element.parentNode) {
                connection.viewProject(this.project.id, this.section.name || 'people');
                this.element.insertBefore(element, this.footer);
            }

            this.updateHeader();
        }
    }

    onProjectChanged(snapshot) {
        this.project = transform.toObj(snapshot);
        if (this.project) {
            if (this.section) {
                this.setSectionElement();
                if (this.section.content.onProjectChanged) {
                    this.section.content.onProjectChanged(this.project);
                }
            }

            this.updateHeader();
            this.updateFooter(session.user.projects && session.user.projects[this.project.id]);
        }
    }

    onUserProjectUpdated(snapshot) {
        this.updateFooter(snapshot.val());
    }

    updateHeader() {
        var actions;
        var content = this.section && this.section.content;
        if (content && content.getHeaderAction) {
            actions = content.getHeaderAction();
        }

        var headerOptions = actions || {};
        headerOptions.title = this.project.name;
        this.header.update(headerOptions);
    }

    updateFooter(userProjectData) {
        if (this.project && userProjectData) {
            for (var i = 0; i < this.sections.length; i++) {
                var section = this.sections[i];
                var property = section.section || 'people'; // Home updates on user changes
                section.button.classList.toggle('has-update', projectTypeHasUpdate(this.project, userProjectData, property));
            }

            if (this.section && this.section.onUserProjectUpdated) {
                this.section.onUserProjectUpdated(userProjectData);
            }
        }
    }
}