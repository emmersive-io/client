import connection from '../firebase/connection';
import session from '../firebase/session';
import transform from '../firebase/transform';
import List from '../core/sortedElementList';
import ListItem from '../elements/taskListItem';
import SwipeHandler from '../core/swipeHandler';


export default class TaskList {
    constructor(projectId) {
        this.projectId = projectId;
        this.element = document.createElement('div');
        this.element.className = 'project-tasks scrollable';
        this.element.innerHTML = `
            <ul class="task-list"></ul>
            <form class="task--new">
                <input type="text" placeholder="Add a task" aria-label="Add a task"/>
                <button class="hidden" tabindex="-1" aria-hidden="true"></button>
            </form>`;

        this.newTask = this.element.lastElementChild;
        this.list = new List(this.element.firstElementChild);
        this.swipeHandler = new SwipeHandler(this.element, '.task__foreground');

        this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);
        this.element.addEventListener('change', this.onStatusChanged.bind(this), true);
        this.element.addEventListener('click', this.onDeleteButtonClick.bind(this), this);

        this.taskRef = connection.firebase.child('tasks/' + projectId);
        this.taskRef.on('child_added', this.onTaskAdded, this);
        this.taskRef.on('child_changed', this.onTaskChanged, this);
        this.taskRef.on('child_removed', this.onTaskRemoved, this);
    }

    onDeleteButtonClick(e) {
        var deleteButton = e.target.closest('.task__delete-button');
        var taskElement = deleteButton && deleteButton.closest('.checkbox-card');
        if (taskElement) {
            var task = this.list.get(task => task.element === taskElement);
            connection.removeTask(this.projectId, task.id);
        }
    }

    onNewTask(e) {
        e.preventDefault();
        var content = this.newTask.elements[0].value.trim();
        if (content) {
            connection.createTask(this.projectId, content);
            this.newTask.reset();
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
            connection.updateTask(this.projectId, task.id, data);
        }
    }

    onTaskAdded(snapshot) {
        var item = new ListItem();
        this.list.add(item);
        item.update(transform.toObj(snapshot));
    }

    onTaskChanged(snapshot) {
        var taskId = snapshot.key();
        var task = this.list.get(task => task.id === taskId);
        if (task) {
            task.update(snapshot.val());
        }
    }

    onTaskRemoved(snapshot) {
        var taskId = snapshot.key();
        this.list.removeBy(task => task.id === taskId);
    }

    remove() {
        this.taskRef.off('child_added', this.onTaskAdded, this);
        this.taskRef.off('child_changed', this.onTaskChanged, this);
        this.taskRef.off('child_removed', this.onTaskRemoved, this);
    }
}