import connection from '../firebase/connection';
import firebase from '../firebase/ref';
import session from '../firebase/session';
import transform from '../firebase/transform';
import List from '../core/sortedElementList';
import ListItem from '../elements/taskListItem';
import SwipeHandler from '../core/swipeHandler';
import getIcon from '../elements/icon';


export default class ProjectTasks {
    constructor(project) {
        this.project = project;
        this.element = document.createElement('div');
        this.element.className = 'project-tasks scrollable';
        this.element.innerHTML = `
            <ul class="task-list"></ul>
            <form class="task--new">
                <button class="button--icon">${getIcon('plus')}</button>            
                <input type="text" placeholder="Add a task" aria-label="Add a task"/>
            </form>`;

        this.newTaskForm = this.element.lastElementChild;
        this.list = new List(this.element.firstElementChild);
        this.newTaskInput = this.newTaskForm.lastElementChild;
        this.swipeHandler = new SwipeHandler(this.element, '.task__foreground');

        this.newTaskForm.addEventListener('submit', this.onNewTask.bind(this), false);
        this.element.addEventListener('change', this.onStatusChanged.bind(this), true);
        this.element.addEventListener('click', this.onDeleteButtonClick.bind(this), this);

        this.taskRef = firebase.root.child('tasks/' + project.id);
        this.taskRef.on('child_added', this.onTaskAdded, this);
        this.taskRef.on('child_changed', this.onTaskChanged, this);
        this.taskRef.on('child_removed', this.onTaskRemoved, this);
    }

    onDeleteButtonClick(e) {
        var deleteButton = e.target.closest('.task__delete-button');
        var taskElement = deleteButton && deleteButton.closest('.checkbox-card');
        if (taskElement) {
            var task = this.list.get(task => task.element === taskElement);
            connection.removeTask(this.project.id, task.id);
        }
    }

    onNewTask(e) {
        e.preventDefault();
        var content = this.newTaskInput.value.trim();
        if (content) {
            connection.createTask(this.project.id, content);
            this.newTaskForm.reset();
        }
    }

    onStatusChanged(e) {
        var taskElement = e.target.closest('.checkbox-card');
        if (taskElement) {
            var data = {};
            var userId = session.user.id;

            if (e.target.tagName === 'INPUT') {
                data.status = e.target.checked ? 'closed' : 'open';
                data.updated_status = userId;
            }
            else {
                data.description = e.target.value;
                data.updated_by = userId;
            }

            var task = this.list.get(task => task.element === taskElement);
            connection.updateTask(this.project.id, task.id, data);
        }
    }

    onTaskAdded(snapshot) {
        var item = new ListItem();
        this.list.add(item);
        item.update(transform.toObj(snapshot));
    }

    onTaskChanged(snapshot) {
        var taskId = snapshot.key;
        var task = this.list.get(task => task.id === taskId);
        if (task) {
            task.update(snapshot.val());
        }
    }

    onTaskRemoved(snapshot) {
        var taskId = snapshot.key;
        this.list.removeBy(task => task.id === taskId);
    }

    remove() {
        this.taskRef.off('child_added', this.onTaskAdded, this);
        this.taskRef.off('child_changed', this.onTaskChanged, this);
        this.taskRef.off('child_removed', this.onTaskRemoved, this);
    }
}