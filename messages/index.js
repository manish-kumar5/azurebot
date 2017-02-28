"use strict";

require('dotenv-extended').load(); 
 
var builder = require('botbuilder'); 
var botbuilder_azure = require("botbuilder-azure");
var restify = require('restify'); 
var store = require('./store');
var spellService = require('./spell-service');
var format = require("string-template");
var compile = require("string-template/compile");

var policyTemplate = compile(
`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
### I have found the policy details for policy number - {0}  
** Details as follows:** \n\n

> Policy Name:    *{1}*\n
> Policy Duration: *{2}*\n
> Valid Upto: *{3}*\n
> Start Date: *{4}*\n
> End Date: *{5}*\n
> Premium Amount: *{6}*\n
> Currency: *{7}*\n
> Commission Amount: *{8}*
`);
 
 var accountTemplate = compile(
`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
### I have found the account details for account number - {0}  
** Details as follows: **

> Account Holder Name: *{1}*\n
> Registered Policies: *{2}*\n
> Create Date: *{3}*`);



var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/19b3eb0c-58e1-4a2c-a4e7-ae2fce8c79e3?subscription-key=7c76b26278854cb1858bb06c58484982&verbose=true';

var recognizer = new builder.LuisRecognizer(LuisModelUrl); 

/*bot.dialog('/', function (session) {
    session.send('You said local:' + session.message.text);
});*/

bot.dialog('/', 
    //function(session){session.send('Hello I am bot')}
    new builder.IntentDialog({ recognizers: [recognizer] }) 
    .matches('Welcome', (session, args) => {
            session.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
            Welcome to Policy Bot! What can i help you with?`); 
         }
     )
     .matches('bye', (session, args) => {
            session.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
            Bye!! Take care..`); 
         }
     )
     .matches('Help', builder.DialogAction.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
     Hi! Try asking me things like \'tell me about my policy\', \'tell me about my policy number xxxx\' or \'show me my account details\'`)) 
     .matches('PolicyQuery', [
        function (session, args, next) {
            session.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
            I are analyzing your message: \'%s\'`, session.message.text);

            // try extracting entities
            var policyname = builder.EntityRecognizer.findEntity(args.entities, 'policyname');
            
            if (policyname) {
                // city entity detected, continue to next step
                session.dialogData.searchType = 'policy';
                next({ response: policyname.entity });
            } else {
                // no entities detected, ask user for a destination
                builder.Prompts.text(session, `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                Please enter your policy number`);
            }
        },
        function (session, results) {
            var policynumber = results.response;

            var message = 'Looking for policy number:' + policynumber;
            

            session.send(message);

            // Async search
            store
                .searchPolicy(policynumber)
                .then((policy) => {

                    if(policy){
                        var message = policyTemplate(policynumber, policy.policyname, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
                    }else{
                        message = `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                        Sorry!! Could not found policy data for policy number - ` + policynumber;
                    }
                    session.send(message);

                    // End
                    session.endDialog();
                });
        }
    ])
    .matches('accountquery', [
        function (session, args, next) {
            session.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
            We are analyzing your message: \'%s\'`, session.message.text);

            // try extracting entities
            var accountnumber = builder.EntityRecognizer.findEntity(args.entities, 'accountno');
            
            if (accountnumber) {
                // city entity detected, continue to next step
                session.dialogData.searchType = 'account';
                next({ response: accountnumber.entity });
            } else {
                // no entities detected, ask user for a destination
                builder.Prompts.text(session, `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                Please enter your account number`);
            }
        },
        function (session, results) {
            var accountnumber = results.response;

            var message = 'Looking for account number:' + accountnumber;
            

            session.send(message);

            // Async search
            store
                .searchAccounts(accountnumber)
                .then((account) => {

                    if(account){
                        var message = accountTemplate(accountnumber, account.accountholdername, JSON.stringify(account.registeredpolicies, null, 4), account.createdate);
                    }else{
                        message = `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                        Sorry!! Could not found account data for account number - ` + accountnumber;
                    }
                    session.send(message);

                    // End
                    session.endDialog();
                });
        }
    ])
    .onDefault((session) => {
         session.send(`![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
         Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.`, session.message.text); 
     })
); 

bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(text => {
                    session.message.text = text;
                    next();
                })
                .catch((error) => {
                    console.error(error);
                    next();
                });
        }
    });

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
