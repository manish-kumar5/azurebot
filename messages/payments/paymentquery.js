var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        if (session.userData && session.userData.username) {
            var msg = 'Hi  ' + session.userData.username + '!!. How may I assist you?'
            builder.Prompts.text(session, msg);
        }
        else {
            session.userData.userStep = 'payment';
            session.beginDialog('authentication');
        }
    }
];

