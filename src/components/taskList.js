import connection from '../firebase/connection';
import session from '../firebase/session';
import transform from '../firebase/transform';

import moment from 'moment';
import SwipeHandler from '../core/swipeHandler';
import sizeTextarea from '../core/sizeTextarea';


export default class TaskList {
    constructor(projectId) {
        this.projectId = projectId;
        this.tasks = [];

        this.element = document.createElement('div');
        this.element.className = 'project-tasks scrollable';
        this.element.innerHTML = `
            <ul class="task-list"></ul>
            <form class="task--new">
                <input type="text" placeholder="Add a task" aria-label="Add a task"/>
                <button class="hidden" tabindex="-1" aria-hidden="true"></button>
            </form>`;

        this.newTask = this.element.lastElementChild;
        this.taskList = this.element.firstElementChild;
        this.swipeHandler = new SwipeHandler(this.element, '.task__foreground');

        this.newTask.addEventListener('submit', this.onNewTask.bind(this), false);
        this.element.addEventListener('change', this.onStatusChanged.bind(this), true);
        this.element.addEventListener('click', this.onTaskDelete.bind(this), this);

        this.taskRef = connection.firebase.child('tasks/' + projectId);
        this.taskRef.on('child_added', this.onTaskAdded, this);
        this.taskRef.on('child_changed', this.onTaskChanged, this);
        this.taskRef.on('child_removed', this.onTaskRemoved, this);
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

            connection.updateTask(this.projectId, taskElement.dataset.id, data);
        }
    }

    onTaskDelete(e) {
        var deleteButton = e.target.closest('.task__delete-button');
        if (deleteButton) {
            var taskElement = deleteButton.closest('.checkbox-card');
            if (taskElement) {
                connection.removeTask(this.projectId, taskElement.dataset.id);
            }
        }
    }

    onTaskAdded(snapshot) {
        var task = transform.toObj(snapshot);
        task.isComplete = (task.status !== 'open');

        this.taskList.insertAdjacentHTML('beforeend', `
            <li class="checkbox-card" data-id="${task.id}">
                <div class="task__foreground">
                    <div class="task__header">
                        <a class="user-name"></a>
                        <span class="item__date"></span>
                    </div>
                    <div class="task__content">
                        <input type="checkbox" class="task__checkbox" />
                        <textarea class="task__description" rows="1">${task.description}</textarea>
                    </div>
                </div>
                <div class="task__background">
                    <button class="task__delete-button">
                        <span class="fa fa-trash" aria-hidden="true"></span>
                        <span>Delete</span>
                    </button>
                </div>
            </li>`);

        task.element = this.taskList.lastElementChild;
        task.content = task.element.querySelector('.task__content');
        task.content.firstElementChild.checked = (task.status !== 'open');

        this.tasks.push(task);
        this.updateLastAction(task);
        sizeTextarea(task.content.lastElementChild);
    }

    onTaskChanged(snapshot) {
        var taskId = snapshot.key();
        var index = this.tasks.findIndex(function (task) {
            return task.id === taskId;
        });

        var task = this.tasks[index];
        Object.assign(task, snapshot.val());

        task.content.firstElementChild.checked = (task.status !== 'open');
        task.content.lastElementChild.textContent = task.description;
        sizeTextarea(task.content.lastElementChild);
        this.updateLastAction(task);
    }

    onTaskRemoved(snapshot) {
        var taskId = snapshot.key();
        var index = this.tasks.findIndex(task => task.id === taskId);
        if (index >= 0) {
            this.tasks.splice(index, 1)[0].element.remove();
        }
    }

    remove() {
        this.taskRef.off('child_added', this.onTaskAdded, this);
        this.taskRef.off('child_changed', this.onTaskChanged, this);
        this.taskRef.off('child_removed', this.onTaskRemoved, this);
    }

    updateLastAction(task) {
        var actionDate = task.updated_at || task.created_at;
        if (task.actionDate !== actionDate) {
            task.actionDate = actionDate;

            connection.getUser(task.updated_by || task.created_by).then(function (user) {
                var header = task.element.querySelector('.task__header');

                if (user) {
                    header.firstElementChild.href = '#profile/' + user.id;
                    header.firstElementChild.textContent = user.name;
                }

                if (task.updated_at > task.created_at) {
                    header.lastElementChild.textContent = 'updated ' + moment(task.updated_at).fromNow();
                }
                else {
                    header.lastElementChild.textContent = 'created ' + moment(task.created_at).fromNow();
                }
            });
        }
    }
}