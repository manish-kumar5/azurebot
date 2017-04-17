var builder = require('botbuilder');
var store = require('../store');
var format = require("string-template");
var compile = require("string-template/compile");

var beneficiaryTemplate = compile(
    `<b>Beneficiary details as follows:</b>
<table border="1">
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
            session.userData.userStep = 'beneficiary';
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