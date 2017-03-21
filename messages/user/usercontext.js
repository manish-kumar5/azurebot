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

        session.send("UserContext Successful");
    }
];