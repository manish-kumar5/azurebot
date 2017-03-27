var builder = require('botbuilder');
var store = require('../store');

module.exports = [
    function (session, args, next) {
        var login_msg = "<b>" + session.userData.username + "</b>,  Please provide me your login id";
        var retry_msg = "Oops!! The userid provided by you does not match our records. Please check and Please provide again.";
        if (parseInt(session.userData.retry_userid) == 0) {
            builder.Prompts.text(session, login_msg);
        } else {
            builder.Prompts.text(session, retry_msg);
        }
    },
    function (session, results) {
        var loginid = results.response;
        var validuserid = store.validateUserid(loginid, session.userData.username);
        if (validuserid) {
            var passreset_msg = '<b>' + session.userData.username + '</b>,  The user id provided by you is correct as per our records. It seems the problem is with password. Can i reset your password?';
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
                            "title": "Password Reset",
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
                var msg = "<b>" + session.userData.username + "</b>, Your password has been reset to <b>1234</b>. Please click below login link to try again. Also please reset your password after successful login<br> <a href='#'>Login</a><br> ";
                msg += "Do you have any further query?";
                //msg += '<input type="button" onclick="hello(this)" value="Yes" id="Yes">&nbsp;<input type="button" onclick="hello(this)" value="No" id="No">';
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
                                "subtitle": msg,
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
        } else {
            //session.endDialog();
            session.beginDialog('maxretry');
        }
    },
    function (session, results) {
        if (results.response) {
            if (results.response.entity == "No") {
                //session.endDialog();
                session.beginDialog('feedback');
            } else {
                //session.endDialog();
                session.beginDialog('root');
            }

        } else {
            //session.endDialog();
            session.beginDialog('maxretry');
        }
    }
];

//Helpers