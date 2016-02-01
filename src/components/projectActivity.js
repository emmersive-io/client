var projects = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/tabActivity.html');
var itemTemplate = require('../templates/activityItem.html');
var defaultUserImage = require('../images/profile.png');


function ProjectActivityPage(projectId) {
    this.title = 'Projects';
    this.element = renderTemplate(template);
    projects.getActivity(projectId, this.renderActivity.bind(this));
}

ProjectActivityPage.prototype = {
    templateMap: {
        date: '.activity__date',
        description: '.activity__description',
        image: '.activity__image',
        name: '.activity__user',
        userProfilePage: {target: '.activity__user', prop: 'href'}
    },

    renderActivity: function (activity) {
        var list = document.createElement('ul');
        list.className = 'activity-list';

        for (var id in activity) {
            var item = activity[id];
            list.appendChild(renderTemplate(itemTemplate, {
                image: item.userImage || defaultUserImage,
                description: item.description,
                date: item.created,
                name: item.name,
                userProfilePage: '#profile/' + id
            }, this.itemTemplateMap));
        }

        this.element.appendChild(list);
    }
};

module.exports = ProjectActivityPage;