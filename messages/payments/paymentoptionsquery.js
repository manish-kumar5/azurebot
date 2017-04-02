var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var DialogLabels = {
            make_payment: 'Pay Premium',
            policy_info: 'Account Information'
        };
        var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Policy Payment Query",
                        "subtitle": '<strong>' + session.userData.username + "</strong>, I have located your account. Please choose from the options below):",
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Account Information",
                                "value": "Account Information"
                            },
                            {
                                "type": "postBack",
                                "title": "Pay Premium",
                                "value": "Pay Premium"
                            }
                        ]
                    }
                }
            ]
        }
        builder.Prompts.choice(
            session, msg,
            [DialogLabels.policy_info, DialogLabels.make_payment],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, results) {
        if (results.response) {
            var resp = results.response.entity;
            session.endDialog();
            if (resp == "Account Information") {
                session.beginDialog('accountinfo');
            }
            else if (resp == "Pay Premium") {
                session.beginDialog('paypremium');
            } else {
                session.beginDialog('/');
            }
        }
        else {
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];

