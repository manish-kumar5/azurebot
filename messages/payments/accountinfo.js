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
    </table>`
);

module.exports = [
    function (session, args, next) {
        var beneficiary = store.searchBeneficiary(session.userData.certno);
        if (beneficiary) {
            var beninfo = beneficiaryTemplate(beneficiary.name, beneficiary.address, beneficiary.dob, beneficiary.phone);
        }
        else {
            var beninfo = "Sorry!! No account information found";
        }
        builder.Prompts.text(session, beninfo + `<br> Do you have any other questions regarding the payments?`);
    },
    function (session, results) {
        if (results.response) {
            var resp = results.response.toLowerCase();
            //session.endDialog();
            if (resp == "yes") {
                session.beginDialog('paymentoptionsquery');
            }
            if (resp == "no") {
                session.beginDialog('thanks');
            }
            else {
                session.beginDialog('/');
            }
        }
    }
];