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
                        "title": "",
                        "subtitle": "<b>" + session.userData.username + "</b>, Please choose one of the options you would like to get help!",
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Policy",
                                "value": "Policy Query"
                            },
                            {
                                "type": "postBack",
                                "title": "Payment",
                                "value": "Payment"
                            },
                            {
                                "type": "postBack",
                                "title": "Login Help",
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
                session.beginDialog('policyquery');
            }else if(results.response.entity == "Website Issue"){
                session.beginDialog('webissue');
            }else{
                session.beginDialog('policyquery');
            }
        }else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];
