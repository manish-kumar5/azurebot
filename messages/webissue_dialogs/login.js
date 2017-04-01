var builder = require('botbuilder');
var store = require('../store');

module.exports = [
    function (session, args, next) {
        var login_msg = "I can help you with login. Please type your login ID";
        var retry_msg = "Oops!! The userid provided by you does not match our records. Please check and provide again.";
        if (parseInt(session.userData.retry_userid) > 0) {
            builder.Prompts.text(session, retry_msg);
            
        } else {
            builder.Prompts.text(session, login_msg);
        }
    },
    function (session, results) {
        var loginid = results.response;
        var validuserid = store.validateUserid(loginid, session.userData.username);
        if (validuserid) {
            var passreset_msg = 'I was able to confirm your login ID. If you’re having trouble logging in I can email you the instructions on how to set a new password. Would you like me to do that?';
            //passreset_msg += '<input type="button" onclick="hello(this)" value="Yes" id="Yes"><input type="button" onclick="hello(this)" value="No" id="No">';
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
                            "subtitle": passreset_msg,
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
            builder.Prompts.choice(session, msg, ["Yes", "No"],
                {
                    maxRetries: 3,
                    retryPrompt: 'Not a valid option'
                });

        }
        else {
            session.userData.retry_userid = parseInt(session.userData.retry_userid) + 1;
            if (parseInt(session.userData.retry_userid) > 2) {
                session.beginDialog('maxretry');
            }
            else {
                session.beginDialog('webissue_login');
            }
        }
    },
    function (session, results) {
        if (results.response) {
            var reset_resp = results.response.entity;
            if (reset_resp == "No") {
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
                                "subtitle": `Ok.. In that case i won't be able to help you further on this. Please reach out to our customer care @ 1800-2333-2333<br>
                                            Do you have any further query?`,
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
                builder.Prompts.choice(session, msg, ["Yes", "No"],
                    {
                        maxRetries: 3,
                        retryPrompt: 'Not a valid option'
                    });
            } else {
                session.beginDialog('validators:email', {
                    prompt: 'Please confirm the email address on file where I should send the instructions',
                    retryPrompt: 'Invalie email. Please check and try again.',
                    maxRetries: 3
                });
            }
        } else {
            //session.endDialog();
            session.beginDialog('maxretry');
        }
    },
    function (session, results) {
        if (results.response) {
            session.userData.email = results.response;
            builder.Prompts.text(session, 'I have sent you instructions on how to set your password to ' + session.userData.email + '. Is there anything else I can help you with?');
        } else {
            //session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];

//Helpers