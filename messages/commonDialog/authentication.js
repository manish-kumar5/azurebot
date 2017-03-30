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
            var msg = `
            <form role="form" data-toggle="validator">
                <div class="container">
                    <div class="form-group">
                        <label class="control-label">I will be happy to assist. First, for verification, may I please have your details<br></label>
                    </div>

                    <div class="form-group">
                        <label for="uid">User Name: </label>
                        <input type="text" class="form-control col-sm-4" id="uid" required>
                    </div>

                    <div class="form-group">
                        <label for="certno">Certificate #: </label>
                        <input type="text" class="form-control" id="certno" required>
                    </div>

                    <div class="form-group">
                        <label for="dob">Date of Birth (MM-DD-YYYY): </label>
                        <input type="text" class="form-control" id="dob" required>
                    </div>

                    <div class="form-group">
                        <label for="tele">Telephone: </label>
                        <input type="text" class="form-control" id="tele" required>
                    </div>

                    <div class="form-group">
                        <label for="ssn">SSN (Last 4 digits): </label>
                        <input type="text" class="form-control" id="ssn" maxlength="4" required>
                    </div>

                    <button type="button" class="btn btn-primary btn-sm" id="btnSubmit" onclick="submitUserInput();">Submit</button>&nbsp; &nbsp;
                    <button type="button" class="btn btn-primary btn-sm" id="btnClear" onclick="clearUserInput();">Clear</button>

                    <div id="lblmsg"></div>
                </div>
            </form>`;

            session.send(msg);
        }
    }
];

