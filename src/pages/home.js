var connection = require('../firebase/connection');
var ProjectListItem = require('../components/projectListItem');
var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/home.html');

function HomePage(header) {
    header.update();
    this.element = renderTemplate(template);
}

module.exports = HomePage;
