var connection = require('../firebase/connection');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/basement.html');
var defaultUserImage = require('../images/profile-inverted.png');


function Basement() {
    this.element = renderTemplate(template);
    this.element.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
            document.body.classList.remove('show-basement');
        }
    }, false);
}

Basement.prototype.render = function () {
    var user = connection.getAuth();
    connection.getUser(user.uid).then(function (user) {
        this.element.querySelector('.basement__user-name').textContent = user.name;
        this.element.querySelector('.basement__header-logo').src = user.image || defaultUserImage;
        this.element.querySelector('.basement__header-button').setAttribute('data-href', '#profile/' + user.id);
    }.bind(this));

    connection.getProjectsForUser(user.uid).then(function (projects) {
        if (projects) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < projects.length; i++) {
                var element = document.createElement('a');
                element.className = 'basement__project';

                var project = projects[i];
                element.textContent = project.name;
                element.href = '#projects/' + project.id;

                fragment.appendChild(element);
            }

            var projectList = this.element.querySelector('.basement__project-list');
            while (projectList.lastElementChild) {
                projectList.lastElementChild.remove();
            }

            projectList.appendChild(fragment);
        }
    }.bind(this));
};

module.exports = Basement;