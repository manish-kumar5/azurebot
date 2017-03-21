var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var policyTemplate = compile(
    `<b> Policy details for certificate number {0} as follows: </b> 
    <table border="0"> 
        <tr> 
            <td>Attributes </td><td>Value </td>
        </tr>
        <tr> 
            <td> Policy Name:</td><td>{1}</td>
        <tr>
        <tr> 
            <td> TPA:</td><td>{2}</td>
        <tr>    
        <tr> 
            <td> Policy Duration:</td><td>{3}</td>
        <tr>
        <tr> 
            <td> Valid Upto:</td><td>{4}</td>
        <tr>
        <tr> 
            <td> Start Date:</td><td>{5}</td>
        <tr>
        <tr> 
            <td> End Date:</td><td>{6}</td>
        <tr>    
        <tr> 
            <td> Premium Amount:</td><td>{7}</td>
        <tr> 
        <tr> 
            <td> Currency:</td><td>{8}</td>
        <tr> 
        <tr> 
            <td> Commission Amount:</td><td>{9}</td>
        <tr>
        </table>
`);

module.exports = [
    function (session, args, next) {
        var policy = store.searchPolicy(session.userData.certno);
        if (policy) {
            var policy_info = policyTemplate(session.userData.certno, policy.policyname, policy.tpa, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
        }
        else {
            var policy_info = "Sorry!! No policy information found";
        }

        var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                        "title": "Policy Information",
                        "subtitle": policy_info + `<br> Do you have further queries w.r.t. your policy`,
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

    },
    function(session, results){
        if(resluts.response){
            var resp = results.response.entity;
            session.endDialog();
            if(resp == "Yes"){
                session.beginDialog('policyquery');
            }
            else {
                session.beginDialog('feedback');
            }
        }
        else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }


];