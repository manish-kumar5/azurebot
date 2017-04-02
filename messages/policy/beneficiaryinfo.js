var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var beneficiaryTemplate = compile(
    `<b>Beneficiary details as follows:</b>
<table border="0">
    <tr> 
        <td>Attributes </td><td>Value </td>
    </tr>
    <tr> 
        <td> Beneficiary Name:</td><td>{0}</td>
    <tr>
    <tr> 
        <td> Address:</td><td>{1}</td>
    <tr>
    <tr> 
        <td> Date of Birth:</td><td>{2}</td>
    <tr>
    <tr> 
        <td> Telephone:</td><td>{3}</td>
    <tr>
</table>
`
);

module.exports = [
    function (session, args, next) {
        if (session.userData && session.userData.username) {
            var beneficiary = store.searchBeneficiary(session.userData.certno);
            if (beneficiary) {
                var beninfo = beneficiaryTemplate(beneficiary.name, beneficiary.address, beneficiary.dob, beneficiary.phone);
            }
            else {
                var beninfo = "Sorry!! No beneficiary information found";
            }
            builder.Prompts.text(session, beninfo + `<br> Do you have any other questions regarding the policy?`);
        }else{
            session.userData.userStep = 'beneficiaryinfo';
            session.beginDialog('authentication');
        }
        /*var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Beneficiary Information",
                        "subtitle": beninfo + `<br>Do you have further queries w.r.t. your policy`,
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
            //else {
            //    session.beginDialog('/');
           // }
        }
        /*else{
            session.endDialog();
            session.beginDialog('maxretry');
        }*/
    }


];