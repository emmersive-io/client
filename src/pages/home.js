var auth = require('../firebase/auth');
var projects = require('../firebase/projects');
var users = require('../firebase/user');

var ProjectListItem = require('../components/projectListItem');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/home.html');


function HomePage(header) {
    this.header = header;
}

HomePage.prototype.onRoute = function () {
    var user = auth.get();
    return projects.getByUser(user.uid).then(function (projects) {
        this.header.update({title: 'My Projects'});
        this.element = renderTemplate(template);

        if (projects && projects.length) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < projects.length; i++) {
                var project = projects[i];
                fragment.appendChild(new ProjectListItem(project.id, project).element);
            }

            this.element.querySelector('.project-list').appendChild(fragment);
        }
        else {
            this.element.querySelector('.button--create-project').hidden = false;
        }
    }.bind(this));
};

module.exports = HomePage;