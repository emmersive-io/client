var animate = require('../core/animate');
var projectRef = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectEdit.handlebars');


function ProjectCreatePage(header) {
    this.header = header;
    this.header.update({leftAction: 'back'});

    this.element = renderTemplate(template({action: 'Create Project'}));
    this.element.addEventListener('click', function (e) {
        var button = e.target.closest('button');
        if (button) {
            var project = {
                name: this.element.querySelector('.project__name').value.trim(),
                description: this.element.querySelector('.project__description').value.trim()
            };

            projectRef.create(project).then(function (projectId) {
                location.assign('#projects/' + projectId);
            }).catch(function () {
                animate(button, 'anim--shake');
            });
        }
    }.bind(this), false);
}

module.exports = ProjectCreatePage;