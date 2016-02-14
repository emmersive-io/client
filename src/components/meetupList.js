var renderTemplate = require('../core/renderTemplate');
var template = require('../templates/meetupList.html');


function MeetupList() {
    this.element = renderTemplate(template);
}

module.exports = MeetupList;