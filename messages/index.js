"use strict";

require('dotenv-extended').load();

var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var restify = require('restify');
var store = require('./store');
var spellService = require('./spell-service');



var useEmulator = (process.env.NODE_ENV == 'development');

//useEmulator = true;

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e84800b9-71c8-427a-8293-3753fdef91d0?subscription-key=28157a31efd94502b9b3d73cb9342830&verbose=true&timezoneOffset=0&q=';
//'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/31405de0-f7c2-4e12-a23d-1a9a41e8c0f1?subscription-key=7f3caa5ead5c4b1aa323ec6ca520fa9f&verbose=true&timezoneOffset=0.0&spellCheck=true&q=';

//'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d038ba40-63ff-4878-b1ae-c18c5cc11c9c?subscription-key=ae9a9c2ba8f34365acd7b032b42ba058&timezoneOffset=0.0&verbose=true&spellCheck=true&q=';

//'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/924eee0c-8ca1-49a4-b652-9ac5f7d09f9e?subscription-key=7c76b26278854cb1858bb06c58484982&verbose=true';

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

bot.dialog('/', [
    function (session, args, next) {
        var user = session.userData.username? session.userData.username: "";
        builder.Prompts.text(session, "I’m sorry, <b>" + user  + " </b>. I don’t yet understand all the commands, but you can ask me to help you with policy questions, making a payment, or login");
    }
]);
bot.dialog('usercontext', require('./user/usercontext')).triggerAction({ matches: 'usercontext' });
bot.dialog('policyquery', require('./policy/policyquery')).triggerAction({ matches: 'policyquery' });
bot.dialog('policy', require('./policy/policyinfo')).triggerAction({ matches: 'policy' });
bot.dialog('beneficiary', require('./policy/beneficiaryinfo')).triggerAction({ matches: 'beneficiary' });
bot.dialog('history', require('./policy/policychangehistory')).triggerAction({ matches: 'history' });

bot.dialog('webissue', require('./webissue_dialogs/webissue')).triggerAction({ matches: 'webissue' });
bot.dialog('webissue_login', require('./webissue_dialogs/login')).triggerAction({ matches: 'webissue_login' });
bot.dialog('maxretry', require('./commonDialog/maxretry')).triggerAction({ matches: 'maxretry' });

bot.dialog('feedback', require('./commonDialog/feedback')).triggerAction({ matches: 'feedback' });
bot.dialog('root', require('./commonDialog/root')).triggerAction({ matches: 'root' });

bot.dialog('payment', require('./payments/paymentquery')).triggerAction({ matches: 'payment' });

bot.dialog('certificatequery', require('./payments/certificatequery')).triggerAction({ matches: 'certificatequery' });

bot.dialog('paymentoptionsquery', require('./payments/paypremium')).triggerAction({ matches: 'paymentoptionsquery' });

bot.dialog('accountinfo', require('./payments/accountinfo')).triggerAction({ matches: 'accountinfo' });

bot.dialog('paypremium', require('./payments/paypremium')).triggerAction({ matches: 'paypremium' });

bot.dialog('authentication', require('./commonDialog/authentication')).triggerAction({ matches: 'authentication' });

bot.dialog('thanks', require('./commonDialog/thanks')).triggerAction({ matches: 'thanks' });

// Validators
bot.library(require('./validators').createLibrary());

var instructions = `<b> <p>I am BEN, your AI support specialist. What can I help you with today?</p></b> <br> I can answer questions related to your policy,
 help you make a payment, or assist with login. To make things easier you can also choose from the options below<br>
        <input type="button" onclick="hello(this)" value="Policy Query" id="Policy Query"><br>
        <input type="button" onclick="hello(this)" value="Make A Payment" id="Payment"><br>
        <input type="button" onclick="hello(this)" value="Login Help" id="Invalid Login">`;

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