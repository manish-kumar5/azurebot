var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var DialogLabels = {
            Policy_Information: 'Policy Information',
            Beneficiary_Information: 'Beneficiary Information',
            Change_History: 'Change History'
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
                        "title": "Policy Query",
                        "subtitle": session.userData.username + ", I can help you with below options w.r.t. your Policy. Please select the option on which you need help or type your question to the input box provided below",
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Policy Information",
                                "value": "Policy Information"
                            },
                            {
                                "type": "postBack",
                                "title": "Beneficiary Information",
                                "value": "Beneficiary Information"
                            },
                            {
                                "type": "postBack",
                                "title": "Policy Change History",
                                "value": "Change History"
                            }
                        ]
                    }
                }
            ]
        }
        builder.Prompts.choice(
            session, msg, 
            [DialogLabels.Policy_Information, DialogLabels.Beneficiary_Information, DialogLabels.Change_History],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
        });
    },
    function(session, results){
        if(results.response){
            var resp = results.response.entity;
            session.endDialog();
            if(resp == "Policy Information"){
                session.beginDialog('policyinfo');
            }
            else if(resp == "Beneficiary Information"){
                session.beginDialog('beneficiaryinfo');
            }else {
                session.beginDialog('policychangehistory');
            }
        }
        else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];

