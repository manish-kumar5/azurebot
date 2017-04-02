var builder = require('botbuilder');
var store = require('../store');

module.exports = [
    function (session, args, next) {
        session.send('I am able to accept a one time payment with a Visa or MasterCard.');

        if (!session.dialogData.card.number) {
            builder.Prompts.text(session, 'What is your card number and the expiration date please');
        }

        next();
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.car.number = result.response;
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.card.expirydate = result.response;

            builder.Prompts.text(session, 'Thank you. The current amount due for December 1, 2016 is $28.48, do I have your permission to process this one time payment?');
            next();
        }
    },
    function (session, result, next) {
        if (result.response) {

            if (results.response.toLowerCase() == "yes") {
                session.send('Thank you. Your payment was approved. Your confirmation number is xxxxxx.');
                session.endDialogWithResult({ response: session.dialogData.card });
            }
        }
    }
];