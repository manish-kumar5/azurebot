var builder = require('botbuilder');

module.exports = [
    function(session){
        var DialogLabels = {
            Policy: 'Policy',
            Payment: 'Payment',
            Webissue: 'Website Issue'
        };
        var instructions = `<b> <p>I am BEN, your AI support representative. What can I help you with today?</p></b> <br> Note: You can choose from below options or type your question in the input box<br>
                <input type="button" onclick="hello(this)" value="Policy" id="Policy"><br>
                <input type="button" onclick="hello(this)" value="Payment" id="Payment"><br>
                <input type="button" onclick="hello(this)" value="Website Issue" id="Website Issue">`;
        builder.Prompts.choice(session, instructions,[DialogLabels.policy, DialogLabels.Payment, DialogLabels.Webissue],{
            maxRetries: 3,
            retryPrompt: 'Not a valid option'
        });
    },
    function(session, results){
        if(resluts.response){
            var resp = results.response.entity;
            session.endDialog();
            if(resp == "Policy"){
                session.beginDialog('policyquery');
            }
            else if(resp == "Payment"){
                session.beginDialog('payment');
            }else {
                session.beginDialog('webissue');
            }
        }
        else{
            session.endDialog();
            session.beginDialog('maxretry');
        }
    }
]