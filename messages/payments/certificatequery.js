var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        //builder.Prompts.text(session, 'Your Certificate Number is on your premium notice, or on your Certificate of Insurance. It is a 12-Digit Number that begins with 000.');
         builder.Prompts.text(session, `Your Certificate Number is on your premium notice, or on your Certificate of Insurance. It is a 12-Digit Number that begins with 000.`);
        //session.beginDialog('paymentoptionsquery');
    }
];