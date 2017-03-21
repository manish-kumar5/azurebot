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

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/924eee0c-8ca1-49a4-b652-9ac5f7d09f9e?subscription-key=7c76b26278854cb1858bb06c58484982&verbose=true';



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
bot.dialog('root', require('./commonDialog/root')).triggerAction({matches:'root'});
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


//bot.dialog('init', require('./commonDialog/init')).triggerAction({matches: 'init'});
//bot.dialog('/', require('./commonDialog/init')).triggerAction({matches:'/'});
    //function(session){session.send('Hello I am bot')}
    //new builder.IntentDialog({ recognizers: [recognizer] })
        /*.matches('usercontext',(session, args) =>{
            var usercontext = JSON.parse(session.message.text);
            session.userData.username = usercontext.username;
            session.userData.ssn = usercontext.ssn;
            session.userData.telephone = usercontext.telephone;
            session.userData.certno = usercontext.cert;
            session.userData.address = usercontext.address;
            session.userData.dob = usercontext.dob;
            session.userData.validation = true;

            session.send("UserContext Successful", session.message.text);
        })
        .matches('welcome', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "",
                            "subtitle": "What can i help you with " + session.userData.username + "? <br> Please select from below mentiond help topics or type your question in the input box. <br>",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Policy Query",
                                    "value": "Policy Query"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Payment Query",
                                    "value": "Payment"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Website Issue",
                                    "value": "Website Issue"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);
        }
        )

        .matches('feedback', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "Feedback",
                            "subtitle": session.userData.username + ", were the informations provided to you appropriate?",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Yes",
                                    "value": "circle"
                                },
                                {
                                    "type": "postBack",
                                    "title": "No",
                                    "value": "circle"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);

        })
        .matches('circleback', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": session.userData.username + ", Do you have any further query?",
                            "subtitle": "",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Yes",
                                    "value": "root"
                                },
                                {
                                    "type": "postBack",
                                    "title": "No",
                                    "value": "Done"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);

        })*/
        /*.matches('root', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": session.userData.username + ", Please choose one of the options you would like to get help!",
                            "subtitle": "",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Policy Query",
                                    "value": "Policy Query"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Payment Query",
                                    "value": "Payment"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Website Issue",
                                    "value": "Website Issue"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);
        })
        .matches('custcare', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "Customer Care Help",
                            "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333\n
                                        Do you have any further query?`,
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Yes",
                                    "value": "root"
                                },
                                {
                                    "type": "postBack",
                                    "title": "No",
                                    "value": "bye"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);
        })
        .matches('bye', (session, args) => {
            var msg = thanks;
            session.send(msg);
        })
        .matches('policyquery', (session, args) => {
            //session.userData.validation = true;
            //session.userData.certno = "000017111984";

            if (!session.userData.validation) {
                session.beginDialog('/verifyuser');
            } else {

                session.beginDialog('/policy', 'policyquery');
                var msg = {
                    "type": "message",
                    "attachmentLayout": "carousel",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                //"text": "Welcome to Mercer Bot! What can i help you with?",
                                "title": "Beneficiary Query",
                                "subtitle": session.userData.username + ", I can help you with below options w.r.t. your Policy. Please select the option on which you need help or type your question to the input box provided below",
                                "buttons": [
                                    {
                                        "type": "postBack",
                                        "title": "Policy Information",
                                        "value": "Policy Information"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "Beneficiary Information",
                                        "value": "Beneficiary Information"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "Policy Change History",
                                        "value": "Change History"
                                    }
                                ]
                            }
                        }
                    ]
                }
                session.send(msg);
            }
        }
        )
        .matches('newconverse',(session, args) => {
            session.beginDialog('/', 'root');
            session.send(`<div class="row msg_container base_receive">
                                        <div class="col-md-2 col-xs-2 avatar">
                                                <img style="height:40px;width:40px;" src="../images/ben.png" class=" img-responsive "/>
                                        </div>
                                        <div class="col-md-10 col-xs-10">
                                            <div class="messages msg_receive">
                                                <p>Please choose from below options or type your question in the input box<br>
                    <input type="button" onclick="hello(this)" value="Policy Query" id="Policy Query"><br>
                    <input type="button" onclick="hello(this)" value="Payment Query" id="Payment Query"><br>
                    <input type="button" onclick="hello(this)" value="Website Issue" id="Website Issue"></p>`, session.message.text);
             //session.endDialog(); 
        })
        .onDefault((session) => {
            session.send(`Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.`, session.message.text);
        })*/
//).triggerAction({matches: '/'});


/*
bot.dialog('/verifyssn', [
    function (session, args, next) {
        if (parseInt(session.userData.retry_ssn) == 0) {
            builder.Prompts.text(session, `For Verification purpose please tell us last four degit of your SSN number`);
        } else {
            builder.Prompts.text(session, `Oops!! This seems an invalid SSN input. Please provide last four degit of your SSN again`);
        }
    },
    function (session, results) {
        var ssn = results.response;
        var beneficiary = store.validateSSN(ssn)
        if (beneficiary) {
            session.userData.ssn = beneficiary.ssn;
            session.beginDialog('/verifyphone');
        } else {
            session.userData.retry_ssn = parseInt(session.userData.retry_ssn) + 1;
            if (parseInt(session.userData.retry_ssn) > 2) {
                session.beginDialog('/', 'root');
                var msg = {
                    "type": "message",
                    "attachmentLayout": "carousel",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                //"text": "Welcome to Mercer Bot! What can i help you with?",
                                "title": "Oops!! You have lost all your retries<br>",
                                "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333<br>
                                            Do you have any further query?`,
                                "buttons": [
                                    {
                                        "type": "postBack",
                                        "title": "Yes",
                                        "value": "root"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "No",
                                        "value": "bye"
                                    }
                                ]
                            }
                        }
                    ]
                }
                session.send(msg);
            } else {
                session.beginDialog('/verifyssn');
            }
        }
    }
]);
bot.dialog('/verifyphone', [
    function (session, args, next) {
        if (parseInt(session.userData.retry_phone) == 0) {
            builder.Prompts.text(session, `For Verification purpose please tell us your telephone number`);
        } else {
            builder.Prompts.text(session, `Oops!! This seems an invalid telephone number. Please provide your Telephone number again`);
        }
    },
    function (session, results) {
        var phone = results.response;
        var beneficiary = store.validatePhone(phone)
        if (beneficiary) {
            session.userData.phone = phone;
            session.beginDialog('/verifydob');
        } else {
            session.userData.retry_phone = parseInt(session.userData.retry_phone) + 1;
            if (parseInt(session.userData.retry_phone) > 2) {
                session.beginDialog('/', 'root');
                var msg = {
                    "type": "message",
                    "attachmentLayout": "carousel",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                //"text": "Welcome to Mercer Bot! What can i help you with?",
                                "title": "Oops!! You have lost all your retries",
                                "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333\n
                                            Do you have any further query?`,
                                "buttons": [
                                    {
                                        "type": "postBack",
                                        "title": "Yes",
                                        "value": "root"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "No",
                                        "value": "bye"
                                    }
                                ]
                            }
                        }
                    ]
                }
                session.send(msg);
            } else {
                session.beginDialog('/verifyphone');
            }
        }
    }
]);
bot.dialog('/verifydob', [
    function (session, args, next) {
        if (parseInt(session.userData.retry_dob) == 0) {
            builder.Prompts.text(session, `For Verification purpose please tell us your date of birth in MM/DD/YYYY format`);
        } else {
            builder.Prompts.text(session, `Oops!! This seems an invalid date of birth according to our records. Please provide your date of birth again in MM/DD/YYYY format`);
        }
    },
    function (session, results) {
        var dob = results.response;
        var beneficiary = store.validateDOB(dob)
        if (beneficiary) {
            session.userData.validation = true;
            session.beginDialog('/policy', 'policyquery');
            //session.send("Hurrey!! Thanks for providing all the details. Your verification is successful!!")
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "Hurrey!! Thanks for providing all the details. Your verification is successful!!",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "Beneficiary Query",
                            "subtitle": "Please select from below query options on which you need help?",
                            "buttons": [
                                {
                                    "type": "postBack",
                                    "title": "Policy Information",
                                    "value": "Policy Information"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Beneficiary Information",
                                    "value": "Beneficiary Information"
                                },
                                {
                                    "type": "postBack",
                                    "title": "Policy Change History",
                                    "value": "Change History"
                                }
                            ]
                        }
                    }
                ]
            }
            session.send(msg);
        } else {
            session.userData.retry_dob = parseInt(session.userData.retry_dob) + 1;
            if (parseInt(session.userData.retry_dob) > 2) {
                session.beginDialog('/', 'root');
                var msg = {
                    "type": "message",
                    "attachmentLayout": "carousel",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                //"text": "Welcome to Mercer Bot! What can i help you with?",
                                "title": "Oops!! You have lost all your retries",
                                "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333\n
                                            Do you have any further query?`,
                                "buttons": [
                                    {
                                        "type": "postBack",
                                        "title": "Yes",
                                        "value": "root"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "No",
                                        "value": "bye"
                                    }
                                ]
                            }
                        }
                    ]
                }
                session.send(msg);
            } else {
                session.beginDialog('/verifydob');
            }
        }
    }
]);
bot.dialog('/verifycert', [
    function (session, args, next) {
        if (parseInt(session.userData.retry_cert) == 0) {
            builder.Prompts.text(session, `For Verification purpose please tell us your certificate number`);
        } else {
            builder.Prompts.text(session, `Oops!! This seems an invalid certification number. Please provide your certificate number again`);
        }
    },
    function (session, results) {
        var certnumber = results.response;
        var validcert = false;
        var policy = store.validateCert(certnumber)
        if (policy) {
            session.userData.certno = certnumber;
            session.beginDialog('/verifyssn');
        } else {
            session.userData.retry_cert = parseInt(session.userData.retry_cert) + 1;
            if (parseInt(session.userData.retry_cert) > 2) {
                session.beginDialog('/', 'root');
                var msg = {
                    "type": "message",
                    "attachmentLayout": "carousel",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                //"text": "Welcome to Mercer Bot! What can i help you with?",
                                "title": "Oops!! You have lost all your retries",
                                "subtitle": `For any further assistance you can contact our 24x7 customer care on 1800-2333-2333\n
                                            Do you have any further query?`,
                                "buttons": [
                                    {
                                        "type": "postBack",
                                        "title": "Yes",
                                        "value": "root"
                                    },
                                    {
                                        "type": "postBack",
                                        "title": "No",
                                        "value": "bye"
                                    }
                                ]
                            }
                        }
                    ]
                }
                session.send(msg);
            } else {
                session.beginDialog('/verifycert');
            }
        }
    }
]);
bot.dialog('/verifyuser', [
    function (session, args, next) {
        session.userData.retry_cert = 0;
        session.userData.retry_ssn = 0;
        session.userData.retry_phone = 0;
        session.userData.retry_dob = 0;
        session.beginDialog('/verifycert')

    }
]);
bot.dialog('/policy',
    new builder.IntentDialog({ recognizers: [recognizer] })
        .matches('newconverse',(session, args) => {
            session.beginDialog('/', 'root');
             session.send(`<div class="row msg_container base_receive">
                                        <div class="col-md-2 col-xs-2 avatar">
                                                <img style="height:40px;width:40px;" src="../images/ben.png" class=" img-responsive "/>
                                        </div>
                                        <div class="col-md-10 col-xs-10">
                                            <div class="messages msg_receive">
                                                <p>Please choose from below options or type your question in the input box<br>
                    <input type="button" onclick="hello(this)" value="Policy Query" id="Policy Query"><br>
                    <input type="button" onclick="hello(this)" value="Payment Query" id="Payment Query"><br>
                    <input type="button" onclick="hello(this)" value="Website Issue" id="Website Issue"></p>`, session.message.text)
            // session.endDialog(); 
        })
        .matches('beneficiaryinformation', (session, args) => {
            // Async search
            store
                .searchBeneficiary(session.userData.certno)
                .then((beneficiary) => {
                    session.beginDialog('/', 'root');
                    if (beneficiary) {

                        //var msg = beneficiaryTemplate(policynumber, policy.policyname, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
                        var msg = beneficiaryTemplate(beneficiary.name, beneficiary.address, beneficiary.dob, beneficiary.phone);
                        //session.send(msg);
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": msg,
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Do you have further queries w.r.t. your policy",
                                        "subtitle": "",

                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    } else {
                        //message = `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                        //Sorry!! Could not found policy data for policy number - ` + policynumber;
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": "",
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Beneficiary Information",
                                        "subtitle": `Sorry!! No beneficiary information is attached to your policy.\n
                                                        Do you have further queries w.r.t. your policy`,
                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    }
                    session.send(msg);

                    // End
                    session.endDialog();
                });
        })
        .matches('policyinformation', (session, args) => {
            // Async search
            store
                .searchPolicy(session.userData.certno)
                .then((policy) => {
                    session.beginDialog('/', 'root');
                    if (policy) {
                        //var msg = beneficiaryTemplate(policynumber, policy.policyname, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
                        var msg = policyTemplate(session.userData.certno, policy.policyname, policy.tpa, policy.policyduration, policy.validupto, policy.startdate, policy.enddate, policy.premium, policy.currency, policy.commission);
                        //session.send(msg);
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": msg,
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Do you have further queries w.r.t. your policy",
                                        "subtitle": "",

                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    } else {
                        //message = `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                        //Sorry!! Could not found policy data for policy number - ` + policynumber;
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": "",
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Policy Information",
                                        "subtitle": `Sorry!! No policy information found.\n
                                                        Do you have further queries w.r.t. your policy`,
                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    }
                    session.send(msg);

                    // End
                    session.endDialog();
                });
        })
        .matches('changehistory', (session, args) => {
            // Async search
            store
                .searchChangehistory(session.userData.certno)
                .then((history) => {
                    session.beginDialog('/', 'root');
                    if (history) {
                        var msg = historyTemplate(history.infoupdated, history.previousvalue, history.updatedvalue, history.updatedate);
                        //session.send(msg);
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": msg,
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Do you have further queries w.r.t. your policy",
                                        "subtitle": "",

                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    } else {
                        //message = `![GitHub Logo](https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTImzntu_iE5Q1GeA2mTZEjjs-tnHuqo2kpUvBiloo8jiR5WUzT4Q) 
                        //Sorry!! Could not found policy data for policy number - ` + policynumber;
                        var msg = {
                            "type": "message",
                            "attachmentLayout": "carousel",
                            "text": "",
                            "attachments": [
                                {
                                    "contentType": "application/vnd.microsoft.card.hero",
                                    "content": {
                                        //"text": "Welcome to Mercer Bot! What can i help you with?",
                                        "title": "Policy Information",
                                        "subtitle": `Sorry!! No change history found.\n
                                                        Do you have further queries w.r.t. your policy`,
                                        "buttons": [
                                            {
                                                "type": "postBack",
                                                "title": "Yes",
                                                "value": "Policy Query"
                                            },
                                            {
                                                "type": "postBack",
                                                "title": "No",
                                                "value": "Feedback"
                                            }
                                        ]
                                    }
                                }
                            ]
                        }

                    }
                    session.send(msg);

                    // End
                    session.endDialog();
                });
        })
        .onDefault((session) => {
            session.send(`Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.`, session.message.text);
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
*/
