var builder = require('botbuilder');

var thanks =
`Thanks for contacting us <br>
For any further help Please reach out to our 24x7 customer care @ <b>1800-3452-3452</b>
Do visit again!! Bye & Take care..
`;

module.exports = [
    function (session, args, next) {
        var msg = {
            "type": "message",
            "attachmentLayout": "carousel",
            "text": "",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Feedback",
                        "subtitle": session.userData.username + ', Please rate me on information provided to you? <br> <div class="row lead"><div id="stars" class="starrr"></div>        You gave a rating of <span id="count">0</span> star(s)</div><br>',
                        "buttons": [
                            {
                                "type": "postBack",
                                "title": "Submit",
                                "value": "Yes"
                            }
                        ]
                    }
                }
            ]
        }
        builder.Prompts.choice(session, msg, ["Yes", "No"], {
            maxRetries: 3,
            retryPrompt: 'Not a valid option'
        });

    },
    function(session, results){
        if(results.response){
                var msg = thanks;
                session.send(msg);
                session.endDialog();
        }
    }
];
