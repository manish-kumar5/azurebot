var builder = require('botbuilder');


module.exports = [
    function (session, args, next) {
        var msg = "<b>" + session.userData.username + "</b>,  <br> Please provide me problem details or error message you get from the portal.";
        session.send(msg);
        session.userData.retry_userid = 0;
        session.endDialog();
        //session.beginDialog('/');
    }
];

//Helpers