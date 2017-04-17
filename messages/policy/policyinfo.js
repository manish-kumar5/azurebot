var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var policyTemplate = compile(
    `<b> Policy details for certificate number {0} as follows: </b> 
    <table border="1"> 
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
         if (session.userData && session.userData.username) {
            var policy = store.searchPolicy(session.userData.certno);
            if (policy) {
                var policy_info = policyTemplate(session.userData.certno, policy.policyname, policy.tpa, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
            }
            else {
                var policy_info = "Sorry!! No policy information found";
            }
            builder.Prompts.text(session, policy_info + `<br> Do you have any other questions regarding the policy?`);
         }else{
            session.userData.userStep = 'policy';
            session.beginDialog('authentication');
         }
    },
    function(session, results){
        if(results.response){
            var resp = results.response.toLowerCase().trim();
            //session.endDialog();
            if(resp === "yes" || resp.indexOf("yes") > -1){
                session.beginDialog('policyquery');
            }
            if(resp === "no" || resp.indexOf("no") > -1){
                session.beginDialog('thanks');
            }
        }
    }


];