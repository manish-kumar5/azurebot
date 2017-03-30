var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var historyTemplate = compile(
`
<b>Policy change history details as follows:</b>
<table border="0">
    <tr> 
        <td>Attributes </td><td>Value </td>
    </tr>
    <tr> 
        <td> Information Updated:</td><td>{0}</td>
    <tr>
    <tr> 
        <td> Previous Value:</td><td>{1}</td>
    <tr>
    <tr> 
        <td> Updated Value:</td><td>{2}</td>
    <tr>
    <tr> 
        <td> Updated Date:</td><td>{3}</td>
    <tr>
`
);

module.exports = [
    function (session, args, next) {
        var policy = store.searchChangehistory(session.userData.certno);
        if (policy) {
            var msg_history = historyTemplate(history.infoupdated, history.previousvalue, history.updatedvalue, history.updatedate);
        }
        else {
            var msg_history = "Sorry!! No policy information found";
        }
        builder.Prompts.text(session, msg_history + `<br> Do you have any other questions regarding the policy?`);
        /*var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Policy Change History",
                        "subtitle": msg_history + `<br>Do you have further queries w.r.t. your policy`,
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
        */
    },
    function(session, results){
        if(results.response){
            var resp = results.response.toLowerCase();
            //session.endDialog();
            if(resp == "yes"){
                session.beginDialog('policyquery');
            }
            if(resp == "no"){
                session.beginDialog('thanks');
            }
            else {
                session.beginDialog('/');
            }
        }
        /*else{
            session.endDialog();
            session.beginDialog('maxretry');
        }*/
    }


];