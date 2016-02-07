var auth = require('../firebase/auth');
var projects = require('../firebase/projects');
var users = require('../firebase/user');

var ProjectListItem = require('../components/projectListItem');
var profileImageRed = require('../images/profile-red.png');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/home.html');


function HomePage(header) {
    var user = auth.get();
    this.element = renderTemplate(template);

    header.update({
        showBackButton: false,
        action: user && {
            icon: 'fa fa-cog',
            href: '#profile/' + user.uid
        }
    });

    if (user) {
        Promise.all([
            users.get(user.uid),
            projects.getByUser(user.uid)
        ]).then(this.render.bind(this));
    }
    else {
        this.element.classList.add('logged-out');
    }
}

HomePage.prototype.render = function (results) {
    var user = results[0];
    var projects = results[1];

    var userSection = this.element.querySelector('.user-section');
    var projectList = this.element.querySelector('.project-list');

    userSection.href = '#profile/' + user.id;
    userSection.querySelector('.user__name').textContent = user.name;
    userSection.querySelector('.user__email').textContent = user.email;
    userSection.querySelector('.profile-image').src = user.image || profileImageRed;

    if (projects.length) {
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < projects.length; i++) {
            var project = projects[i];
            fragment.appendChild(new ProjectListItem(project.id, project).element);
        }

        projectList.appendChild(fragment);
    }
    else {
        projectList.hidden = true;
    }

    this.element.classList.add('logged-in');
};

module.exports = HomePage;