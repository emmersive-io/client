import connection from '../firebase/connection';
import {humanizeDate} from '../core/humanize';
import {sizeToContent} from '../core/sizeTextarea';

export default class TaskListItem {
    constructor() {
        this.task = {};
        this.element = document.createElement('li');
        this.element.className = 'checkbox-card';
        this.element.innerHTML = `
            <div class="task__foreground">
                <div class="task__header">
                    <a class="user-name"></a>
                    <span class="item__date"></span>
                </div>
                <div class="task__content">
                    <input type="checkbox" class="task__checkbox" ${this.isComplete ? 'checked' : ''} />
                    <textarea class="task__description" rows="1">${this.task.description}</textarea>
                </div>
            </div>
            <div class="task__background">
                <button class="task__delete-button">
                    <span class="fa fa-trash" aria-hidden="true"></span>
                    <span>Delete</span>
                </button>
            </div>`;

        var foreground = this.element.firstElementChild;
        this.header = foreground.firstElementChild;
        this.content = foreground.lastElementChild;
    }

    set date(value) {
        if (this.actionDate !== value) {
            this.actionDate = value;
            this.header.lastElementChild.textContent = humanizeDate(value);
        }
    }

    set description(value) {
        if (this.task.description !== value) {
            var textarea = this.content.lastElementChild;
            textarea.textContent = value;
            sizeToContent(textarea);
        }
    }

    get id() {
        return this.task.id;
    }

    set status(value) {
        if (this.task.status !== value) {
            this.content.firstElementChild.checked = (value !== 'open');
        }
    }

    set user(value) {
        if (this.actionUser !== value) {
            this.actionUser = value;
            connection.getUser(value).then(function (user) {
                if (user && user.id === this.actionUser) {
                    var element = this.header.firstElementChild;
                    element.href = '#profile/' + user.id;
                    element.textContent = user.name;
                }
            }.bind(this));
        }
    }

    update(task) {
        if (task) {
            this.status = task.status;
            this.description = task.description;

            Object.assign(this.task, task);
            this.date = task.updated_at || task.created_at;
            this.user = task.updated_by || task.created_by;
        }
    }
}