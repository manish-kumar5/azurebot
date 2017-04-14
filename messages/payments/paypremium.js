var builder = require('botbuilder');
var store = require('../store');

module.exports = [
    function (session, args, next) {
        var msg = `
                <div class="container" id="paymentDetails">
                    <div class="form-group">
                        <div class="col-sm-12">
                            <!--<label class ="control-label">I am able to accept a one time payment with a Visa or MasterCard.Plese provide your card number and the expiration date <br></label>-->
                            <div class="col-sm-3">
                                <p>I am able to accept a one time payment with a Visa or MasterCard.Plese provide your card number and the expiration date</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <input type="text" maxlength=16 class="form-control input-sm change-width" id="cardnumber" required placeholder="Credit Card Number">
                        </div>
                    </div>

                    <div class ="form-group">
                        <div class ="col-sm-12">
                            //<label class ="control-label">Expiration Month and Year<br/></label>
                            <div class ="col-sm-3">
                                <p>Expiration Month and Year</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-1">
                            <input type="text" class ="form-control input-sm change-width-sm" id="expirationmonth" placeholder="MM" maxlength=2>
                        </div>

                        <div class ="col-sm-11">
                            <input type="text" class ="form-control input-sm change-width-sm" id="expirationyear" placeholder="YY" maxlength=2>
                        </div>
                    </div>

                    <div class ="form-group">
                        <div class ="col-sm-12">
                            <!--<label class ="control-label">I am able to accept a one time payment with a Visa or MasterCard.Plese provide your card number and the expiration date <br></label>-->
                            <p>Three digit security code</p>
                        </div>
                    </div>

                    <div class ="form-group">
                        <div class ="col-sm-12">
                            <input type="text" maxlength=3 class ="form-control input-sm change-width-md" id="seccode" required placeholder="Security Digits">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <br />
                            <button type="button" class="btn btn-primary btn-sm" id="btnSubmit" onclick="submitPaymentInput();">Submit</button>&nbsp; &nbsp;
                            <button type="button" class="btn btn-primary btn-sm" id="btnClear" onclick="clearPaymentInput();">Clear</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-12">
                            <font color="red"><div id="lblpaymentmsg"></div></font>
                        </div>
                    </div>
                </div>`;

        builder.Prompts.text(session, msg);
    },
    function (session, results, next) {
        if (results.response) {
            if (results.response.toLowerCase() == "yes") {
                builder.Prompts.text(session, '<p>Thank you. Your payment was approved. Your confirmation number is xxxxxx. <br><b> Do you have any further query?</b></p>');

            } else {
                builder.Prompts.text(session, '<p>Do you have any further query?</p>');
            }
        }
    },
    function (session, results) {
        if (results.response.toLowerCase() == "yes") {
            session.beginDialog('root');
        } else if (results.response.toLowerCase() == "no") {
            session.beginDialog('thanks');
        }
    }
];