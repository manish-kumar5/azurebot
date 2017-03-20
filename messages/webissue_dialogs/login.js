var builder = require('botbuilder');
var Store = require('./store');

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
        var validuserid = store.validateUserid(userid);
        if (validuserid) {
            var passreset_msg = "<b>" + session.userData.username + "</b>,  The user id provided by you is correct as per our records. It seems the problem is with password. Can i reset your password?<br>";
            passreset_msg += '<input type="button" onclick="hello(this)" value="Yes" id="Yes">&nbsp;<input type="button" onclick="hello(this)" value="No" id="No">';
            builder.Prompts.choice(session, passreset_msg, "Yes|No",
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
            var reset_resp = results.response;
            if (reset_resp == "No") {
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
                                "title": "",
                                "subtitle": `Ok.. In that case i won't be able to help you further on this. Please reach out to our customer care @ 1800-2333-2333<br>
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
            }else{
                var msg = "<b>" + session.userData.username + "</b>, Your password has been reset to <b>1234</b>. Please click below login link to try again. Also please reset your password after successful login<br> <a href='#'>Login</a><br> ";
                msg += "Is there anything else i can help you with?";

                session.endDialog();
                session.beginDialog('/');
                sesion.send(msg);
            }
        } else {
            session.beginDialog('maxretry');
        }
    }
];

//Helpers