var builder = require('botbuilder');

module.exports = [
    function (session, args, next) {
        var msg = `
            <!--<form role="form">-->
                <div class="container" id="authDetails">
                    <div class="form-group">
                        <div class="col-sm-12">
                            <label class="control-label">I will be happy to assist. First, for verification, may I please have your details<br></label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label for="uid">User Name: </label>-->
                            <input type="text" class="form-control input-sm change-width"  id="uid" required placeholder="User Name">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label for="certno">Certificate #: </label>-->
                            <input type="text" class="form-control input-sm change-width" id="certno" placeholder="Certificate #" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label for="dob">Date of Birth (MM-DD-YYYY): </label>-->
                            <input type="text" class="form-control input-sm change-width" placeholder="Date of Birth" id="dob" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label for="tele">Telephone: </label>-->
                            <input type="text" class="form-control input-sm change-width" id="tele" placeholder="Telephone" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label for="ssn">SSN (Last 4 digits): </label>-->
                            <input type="text" class="form-control input-sm change-width" id="ssn" maxlength="4" placeholder="SSN" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <br />
                            <button type="button" class="btn btn-primary btn-sm" id="btnSubmit" onclick="submitUserInput();">Submit</button>&nbsp; &nbsp;
                            <button type="button" class="btn btn-primary btn-sm" id="btnClear" onclick="clearUserInput();">Clear</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <div id="lblauthmsg"></div>
                        </div>
                    </div>
                </div>
            <!--</form>-->`;

        /*
                    var containerHtml = '<div class="row msg_container base_receive">';
                    containerHtml += '            <div class="col-md-2 col-xs-2 avatar">';
                    containerHtml += '                    <img style="height:40px;width:40px;" src="../images/ben.png" class=" img-responsive "/>';
                    containerHtml += '  </div> <div class="col-md-10 col-xs-10"> <div class="messages msg_receive"> <p>';
                    containerHtml += msg;
                    containerHtml += '</p><time datetime="2009-11-13T20:00">BEN at ';
                    containerHtml += new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
                    containerHtml += '</time> </div> </div></div>';
        */

        builder.Prompts.text(session, msg);
        //session.beginDialog('/');
    }
];

