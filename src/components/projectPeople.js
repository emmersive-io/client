var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabPeople.html');
var itemTemplate = require('../templates/userItem.html');
var defaultUserImage = require('../images/profile-red.png');

function ProjectPeople(project) {
    this.element = renderTemplate(template);
    var listElement = this.element.querySelector('ul');
    this.getUsers(project).forEach(function (user) {
        listElement.appendChild(user.element);
    });
}

ProjectPeople.prototype.getUsers = function (project) {
    var users = [];
    for (var id in project.people) {
        var user = project.people[id] || {};
        users.push({
            name: user.name,
            element: renderTemplate(itemTemplate, {
                id: '#profile/' + id,
                name: user.name,
                email: user.email,
                image: user.image || defaultUserImage
            }, {
                name: '.user__name',
                email: '.user__email',
                image: '.profile-image',
                id: {target: '.user', prop: 'href'}
            })
        });
    }

    return users.sort(function (user1, user2) {
        return user1.name.localeCompare(user2.name);
    });
};

module.exports = ProjectPeople;