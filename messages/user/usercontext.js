var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var usercontext = JSON.parse(session.message.text);
        session.userData.username = usercontext.username;
        session.userData.ssn = usercontext.ssn;
        session.userData.telephone = usercontext.telephone;
        session.userData.certno = usercontext.cert;
        session.userData.address = usercontext.address;
        session.userData.dob = usercontext.dob;
        session.userData.validation = true;

        var returnMsg = '<div>Thanks for confirming the details. Verification has been completed succesfully. How may I assist you further.</div>';

        /// If user came from a specific workflow redirect post verification.
        if (session.userData.userStep) {
            // session.send(returnMsg);
            session.beginDialog(session.userData.userStep);
        }
        else {
            builder.Prompts.text(session, returnMsg);
        }
    }
];