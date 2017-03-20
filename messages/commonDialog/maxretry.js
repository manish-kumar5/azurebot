
var builder = require('botbuilder');
var Store = require('./store');

module.exports = [
    function (session, args, next) {
        session.endDialog();
        session.beginDialog('/');
        var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Oops!! You have lost all your retries<br>",
                        "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333<br>
                                            Do you have any further query?`,
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Yes",
                                "value": "root"
                            },
                            {
                                "type": "postBack",
                                "title": "No",
                                "value": "bye"
                            }
                        ]
                    }
                }
            ]
        }
        session.send(msg);
    }

];