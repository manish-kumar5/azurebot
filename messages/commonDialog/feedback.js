var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Feedback",
                        "subtitle": session.userData.username + ", were the informations provided to you appropriate?",
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Yes",
                                "value": "Yes"
                            },
                            {
                                "type": "postBack",
                                "title": "No",
                                "value": "No"
                            }
                        ]
                    }
                }
            ]
        }
        builder.Prompts.choice(session, msg, "Yes|No", {
            maxRetries: 3,
            retryPrompt: 'Not a valid option'
        });

    },
    function (session, results) {
        if (results.response) {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "",
                            "subtitle": session.userData.username + ", Do you have any further query?",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Yes",
                                    "value": "Yes"
                                },
                                {
                                    "type": "postBack",
                                    "title": "No",
                                    "value": "No"
                                }
                            ]
                        }
                    }
                ]
            }
            builder.Prompts.choice(session, msg, "Yes|No", {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });

        } else {
            session.endDialog();
            session.beginDialog('maxretry');
        }
    },
    function(session, results){
        if(results.response){
            session.endDialog();
            if(results.response.entity == "No"){
                session.beginDialog('thanks');
            }else{
                session.beginDialog('root');
            }
        }else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];




