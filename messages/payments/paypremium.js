var builder = require('botbuilder');
var store = require('../store');

module.exports = [
    function (session, args, next) {
        //session.send('I am able to accept a one time payment with a Visa or MasterCard.');

        if (!session.dialogData.cardnumber) { // && session.dialogData.card.number
            builder.Prompts.text(session, 'I am able to accept a one time payment with a Visa or MasterCard. <br> <b> Please provide your card number</b>');
        }
    },
    function (session, results) {
        if (results.response) {

            session.dialogData.cardnumber = results.response;
            builder.Prompts.text(session, 'Please provide card expiration date');
            //next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.card_expirydate = results.response;

            builder.Prompts.text(session, 'Thank you. The current amount due for December 1, 2016 is $28.48, do I have your permission to process this one time payment?');
            //next();
        }
    },
    function (session, results, next) {
        if (results.response) {

            if (results.response.toLowerCase() == "yes") {
                builder.Prompts.text(session, 'Thank you. Your payment was approved. Your confirmation number is xxxxxx. <br><b> Do you have any further query?</b>');

            }else{
                builder.Prompts.text(session, 'Do you have any further query?');
            }
        }
    },
    function(session, results){
        if(results.response.toLowerCase() == "yes"){
            session.beginDialog('paymentoptionsquery');
        }else if(results.response.toLowerCase() == "no"){
            session.beginDialog('thanks');
        }
    }
];