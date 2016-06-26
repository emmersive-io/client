import {slide} from '../core/animate';
import {toObj} from '../firebase/utility/transform';
import {projectTypeHasUpdate} from '../firebase/utility/project';
import session from '../firebase/session';
import getIcon from '../elements/icon';

import ActivityPage from  '../project/activity';
import HomePage from '../project/home';
import MeetupPage from '../project/meetups';
import TaskPage from '../project/tasks';


export default class ProjectPage {
    constructor(options) {
        analytics.page('project');
        this.header = options.header;
        this.sections = [
            {type: HomePage},
            {name: 'activities', type: ActivityPage},
            {name: 'tasks', type: TaskPage},
            {name: 'meetups', type: MeetupPage}
        ];

        this.sections.forEach((x, i) => x.index = i);
    }

    initialize(projectId) {
        this.element = document.createElement('div');
        this.element.className = 'project';
        this.element.innerHTML = `
            <footer class="footer">
                <button class="button--stacked" data-href="#projects/${projectId}">
                    ${getIcon('project')}
                    <span class="button__title">Project</span>
                </button>
                <button class="button--stacked" data-href="#projects/${projectId}/activities">
                    ${getIcon('chat')}
                    <span class="button__title">Discuss</span>
                </button>
                <button class="button--stacked" data-href="#projects/${projectId}/tasks">
                    ${getIcon('tasks')}
                    <span class="button__title">Tasks</span>
                </button>
                <button class="button--stacked" data-href="#projects/${projectId}/meetups">
                    ${getIcon('meetups')}
                    <span class="button__title">Meet up</span>
                </button>
            </footer>`;

        this.footer = this.element.lastElementChild;
        for (var i = 0; i < this.sections.length; i++) {
            this.sections[i].button = this.footer.children[i];
        }

        this.projectRef = session.root.child(`projects/${projectId}`);
        this.userProjectRef = session.root.child(`users/${session.user.id}/projects/${projectId}`);

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

    onRoute(projectId, section) {
        if (!this.element) {
            this.initialize(projectId);
        }

        this.setSelectedSection(section);
    }

    setSelectedSection(sectionName) {
        var oldSection = this.section;
        if (this.section) {
            oldSection.button.classList.remove('selected');
            session.viewProject(this.project.id, oldSection.name || 'people');
        }

        this.section = this.sections.find(section => section.name === sectionName)
                       || this.sections[0];

        this.section.button.classList.add('selected');
        this.setSectionElement();

        if (oldSection && this.section.content) {
            var isMovingForward = this.section.index >= oldSection.index;
            slide(this.section.content.element, oldSection.content.element, isMovingForward);
        }
    }

    setSectionElement() {
        if (this.project) {
            if (!this.section.content) {
                this.section.content = new this.section.type(this.project);
            }

            var element = this.section.content.element;
            if (!element.parentNode) {
                session.viewProject(this.project.id, this.section.name || 'people');
                this.element.insertBefore(element, this.footer);
            }

            this.updateHeader();
        }
    }

    onProjectChanged(snapshot) {
        this.project = toObj(snapshot);
        if (this.project) {
            if (this.section) {
                this.setSectionElement();
                if (this.section.content.onProjectChanged) {
                    this.section.content.onProjectChanged(this.project);
                }
            }
            
            this.updateHeader();
            var projects = session.user.data.projects;
            this.updateFooter(projects && projects[this.project.id]);
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
                var property = section.name || 'people'; // Home updates on user changes
                section.button.classList.toggle('has-update', projectTypeHasUpdate(this.project, userProjectData, property));
            }

            if (this.section && this.section.onUserProjectUpdated) {
                this.section.onUserProjectUpdated(userProjectData);
            }
        }
    }
}