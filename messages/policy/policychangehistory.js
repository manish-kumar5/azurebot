var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var historyTemplate = compile(
`
<b>Policy change history details as follows:</b>
<table border="1">

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
        if (session.userData && session.userData.username) {
            var policy = store.searchChangehistory(session.userData.certno);
            if (policy) {
                var msg_history = historyTemplate(history.infoupdated, history.previousvalue, history.updatedvalue, history.updatedate);
            }
            else {
                var msg_history = "Sorry!! No policy change history found";
            }
            builder.Prompts.text(session, msg_history + `<br> Do you have any other questions regarding the policy?`);
        }else{
            session.userData.userStep = 'policychangehistory';
            session.beginDialog('authentication');
        }
    },
    function(session, results){
        if(results.response){
            var resp = results.response.toLowerCase().trim();
            //session.endDialog();
            if(resp == "yes" || resp.indexOf("yes") > -1){
                session.beginDialog('policyquery');
            }
            if(resp == "no" || resp.indexOf("no") > -1){
                session.beginDialog('thanks');
            }
        }
    }
];