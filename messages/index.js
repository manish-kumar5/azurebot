"use strict";

require('dotenv-extended').load();

var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var restify = require('restify');
var store = require('./store');
var spellService = require('./spell-service');

var thanks =
`Thanks for contacting us <br>
For any further help Please reach out to our 24x7 customer care @ <b>1800-3452-3452</b>
Do visit again!! Bye & Take care..
`;

var useEmulator = (process.env.NODE_ENV == 'development');

//useEmulator = true;

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d038ba40-63ff-4878-b1ae-c18c5cc11c9c?subscription-key=ae9a9c2ba8f34365acd7b032b42ba058&timezoneOffset=0.0&verbose=true&spellCheck=true&q=';

//'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/924eee0c-8ca1-49a4-b652-9ac5f7d09f9e?subscription-key=7c76b26278854cb1858bb06c58484982&verbose=true';

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('usercontext', require('./user/usercontext')).triggerAction({matches: 'usercontext'});
bot.dialog('policyquery', require('./policy/policyquery')).triggerAction({matches: 'policyquery'});
bot.dialog('policyinfo', require('./policy/policyinfo')).triggerAction({matches: 'policyinfo'});
bot.dialog('beneficiaryinfo', require('./policy/beneficiaryinfo')).triggerAction({matches: 'beneficiaryinfo'});
bot.dialog('policychangehistory', require('./policy/policychangehistory')).triggerAction({matches: 'policychangehistory'});

bot.dialog('webissue', require('./webissue_dialogs/webissue')).triggerAction({matches: 'webissue'});
bot.dialog('webissue_login', require('./webissue_dialogs/login')).triggerAction({matches: 'webissue_login'});
bot.dialog('maxretry', require('./commonDialog/maxretry')).triggerAction({matches: 'maxretry'});

bot.dialog('feedback', require('./commonDialog/feedback')).triggerAction({matches: 'feedback'});
bot.dialog('root', require('./commonDialog/root')).triggerAction({ matches: 'root' });

bot.dialog('payment', require('./commonDialog/authentication')).triggerAction({ matches: 'payment' });

bot.dialog('thanks', [
    function(session, args, next){
        var msg = thanks;
        session.send(msg);
        session.endDialog();
    }
]).triggerAction({matches: 'thanks'});

var instructions = `<b> <p>I am BEN, your AI support representative. What can I help you with today?</p></b> <br> Note: You can choose from below options or type your question in the input box<br>
        <input type="button" onclick="hello(this)" value="Policy" id="Policy Query"><br>
        <input type="button" onclick="hello(this)" value="Payment" id="Payment"><br>
        <input type="button" onclick="hello(this)" value="Login Help" id="Website Issue">`;

bot.on('conversationUpdate', function (activity) {
    // when user joins conversation, send instructions
    if (activity.membersAdded) {
        activity.membersAdded.forEach(function (identity) {
            if (identity.id === activity.address.bot.id) {
                var reply = new builder.Message()
                            .address(activity.address)
                            .text(instructions);
                bot.send(reply);
                //bot.beginDialog(activity.address, 'init');
            }
        });
    }
});

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
('error', function (err) { console.error(err) })