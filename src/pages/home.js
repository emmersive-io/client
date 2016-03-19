var connection = require('../firebase/connection');
var ProjectListItem = require('../components/projectListItem');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/home.html');

function HomePage(header) {
    this.header = header;
}

HomePage.prototype.onRoute = function () {
    return connection.getProjectsForUser().then(function (projects) {
        this.header.update({title: 'My Projects'});
        this.element = renderTemplate(template);

        if (projects && projects.length) {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < projects.length; i++) {
                fragment.appendChild(new ProjectListItem(projects[i]).element);
            }

            this.element.querySelector('.project-list').appendChild(fragment);
        }
        else {
            this.element.querySelector('.button--create-project').hidden = false;
        }
    }.bind(this));
};

module.exports = HomePage;
