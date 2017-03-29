var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var msg = '';
        var isAuthenticated = false;

        if (session.userdata && session.userdata.username) {
            isAuthenticated = true;

            msg = 'Hi  ' + session.userdata.username + '!!. Thank you for contacting Insurance Operations. How may I help you?'

            session.send(msg);
        }
        else {
            //var userInputForm = `<b><p>I am BEN, your AI support representative. What can I help you with today?</p></b> <br> Note: You can choose from below options or type your question in the input box<br>`;
            msg += '<p>I will be happy to assist. First, for verification, may I please have your details<br></p>';
            msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="uid">User Name: </label><div class="col-sm-10"><input type="text" class ="form-control" id="uid"></div></div>`;
            msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="certno">Certificate #: </label><div class="col-sm-10"><input type="text" class ="form-control" id="certno"></div></div>`;
            // msg += `<div class ="form-group"><label for="pwd">Password : </label><input type="password" class ="form-control" id="pwd"></div>`;
            msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="dob">Date of Birth (MM-DD-YYYY): </label><div class="col-sm-10"><input type="text" class ="form-control" id="dob"></div></div>`;
            //msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="addr">Address: </label><textarea class="form-control" rows="5" id="addr"></textarea></div>`;
            msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="tele">Telephone: </label><div class="col-sm-10"><input type="text" class ="form-control" id="tele"></div></div>`;
            msg += `<div class ="form-group form-group-sm"><label class="col-sm-2 control-label" for="ssn">SSN (Last 4 digits): </label><div class="col-sm-10"><input type="text" class ="form-control" id="ssn" maxlength="4"></div></div>`;
            msg += `<button type="button" class="btn btn-primary" id="btnSubmit" onclick="submitUserInput();">Submit</button>`;
            msg += `<button type="button" class="btn btn-primary" id="btnCancel" onclick="cancelUserInput();">Cancel</button>`;
            msg += `<div id="lblmsg"></div>`;

            session.send(msg);
        }
    }
];

