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
                        "title": session.userData.username + ", Please choose one of the options you would like to get help!",
                        "subtitle": "",
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Policy Query",
                                "value": "Policy Query"
                            },
                            {
                                "type": "postBack",
                                "title": "Payment",
                                "value": "Payment"
                            },
                            {
                                "type": "postBack",
                                "title": "Website Issue",
                                "value": "Website Issue"
                            }
                        ]
                    }
                }
            ]
        }
        builder.Prompts.choice(session, msg, "Policy Query|Payment|Website Issue", {
            maxRetries: 3,
            retryPrompt: 'Not a valid option'
        });

    },
    function(session, results){
        if(results.response){
            session.endDialog();
            if(results.response.entity == "Policy Query"){
                session.beginDialog('/');
            }else if(results.response.entity == "Website Issue"){
                session.beginDialog('webissue');
            }else{
                session.beginDialog('/');
            }
        }else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];
