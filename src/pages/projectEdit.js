var projects = require('../firebase/projects');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/projectEdit.html');

function NewProjectPage(header) {
    header.update({title: 'Create project'});

    this.element = renderTemplate(template, {
        submitAction: 'Create Project'
    }, this.templateMap);
}

NewProjectPage.prototype = {
    templateMap: {
        submitAction: '.project--submit'
    },

    onFormSubmit: function (e) {
        e.preventDefault();
    }
};

module.exports = NewProjectPage;