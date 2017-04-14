var builder = require('botbuilder');

var thanks =
`Thanks for contacting us <br>
For any further help Please reach out to our 24x7 customer care @ <b>1800-3452-3452</b>
Do visit again!! Bye & Take care..
`;

var Feedback = 
`
<p><b> Feedback </b></p>
<br><br>
<p> Please rate me on information provided to you? <br> 
    <div class="stars">
        <input class="star star-5" id="star-5" type="radio" name="star"/>
        <label class="star star-5" for="star-5"></label>
        <input class="star star-1" id="star-1" type="radio" name="star"/>
        <label class="star star-1" for="star-1"></label>
        <input class="star star-2" id="star-2" type="radio" name="star"/>
        <label class="star star-2" for="star-2"></label>
        <input class="star star-3" id="star-3" type="radio" name="star"/>
        <label class="star star-3" for="star-3"></label>
        <input class="star star-4" id="star-4" type="radio" name="star"/>
        <label class="star star-4" for="star-4"></label>
    </div>
    <div>
        <input type="button" onclick="hello(this)" value="Submit" id="yes">
    </div>
</p>
`

module.exports = [
    function (session) {
        builder.Prompts.text(session, Feedback);
    },
    function(session, results){
        if(results.response){
                var msg = thanks;
                session.send(msg);
                session.endDialog();
        }
    }
];
