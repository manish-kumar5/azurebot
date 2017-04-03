var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        if (session.userData && session.userData.username) {
            builder.Prompts.text(session, session.userData.username + 
            `, I will be happy to help you with your policy question. What would you like to know? (or you can select from the options below):<br>
            <input type="button" onclick="hello(this)" value="Policy Information" id="Policy Information"><br>
            <input type="button" onclick="hello(this)" value="Beneficiary Information" id="Beneficiary Information"><br>
            <input type="button" onclick="hello(this)" value="Change History" id="Change History">`
            );
            /*var DialogLabels = {
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
                            "subtitle": session.userData.username + ", I will be happy to help you with your policy question. What would you like to know? (or you can select from the options below):",
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
            });*/
        }else{
            session.userData.userStep = 'policyquery';
            session.beginDialog('authentication');
        }
    },
    function(session, results){
        if(results.response){
            var resp = results.response;
            //session.endDialog();
            if(resp == "Policy Information"){
                session.beginDialog('policyinfo');
            }
            else if(resp == "Beneficiary Information"){
                session.beginDialog('beneficiaryinfo');
            }else if(resp == "Change History") {
                session.beginDialog('policychangehistory');
            }
        }
        else{
            //session.endDialog();
            session.beginDialog('maxretry');
        }
    }
    
];

