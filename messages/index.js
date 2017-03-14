"use strict";

require('dotenv-extended').load();

var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var restify = require('restify');
var store = require('./store');
var spellService = require('./spell-service');
var format = require("string-template");
var compile = require("string-template/compile");

var thanks =
    ` ![Bot Logo](http://mercertestbot.azurewebsites.net/images/chatbot.jpg) \n \n
Thanks for contacting us \n
For any further help Please reach out to our 24x7 customer care **@ 1800-3452-3452** \n
Do visit again!! Bye & Take care.. 
`

var policyTemplate = compile(
    `![Bot Logo](http://mercertestbot.azurewebsites.net/images/chatbot.jpg) \n \n
Policy details for certificate number {0} as follows: \n \n
   \n
**Policy Name:**    {1}\n
**TPA:**    {2}\n
**Policy Duration:**    {3}\n
**Valid Upto:**     {4}\n
**Start Date:**     {5}\n
**End Date:**   {6}\n
**Premium Amount:**     {7}\n
**Currency:**   {8}\n
**Commission Amount:** {9}\n
`);

var beneficiaryTemplate = compile(
    `![Bot Logo](http://mercertestbot.azurewebsites.net/images/chatbot.jpg)\n\n
   \n
Beneficiary details as follows:\n\n
   \n
**Beneficiary Name:**   \t {0}\n
**Address:** \t{1}\n
**Date of Birth:** \t{2}\n
**Telephone:** \t{3}\n
`
);

var historyTemplate = compile(
    `![Bot Logo](http://mercertestbot.azurewebsites.net/images/chatbot.jpg)\n\n
   \n
Policy change history details as follows:\n\n
   \n
**Information Updated:**   \t {0}\n
**Previous Value:** \t{1}\n
**Updated Value:** \t{2}\n
**Updated Date:** \t{3}\n
`
)

var accountTemplate = compile(
    `![Bot Logo](http://mercertestbot.azurewebsites.net/images/chatbot.jpg) 
### I have found the account details for account number - {0}  
** Details as follows: **
> Account Holder Name: *{1}*\n
> Registered Policies: *{2}*\n
> Create Date: *{3}*`);



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


bot.dialog('/',
    //function(session){session.send('Hello I am bot')}
    new builder.IntentDialog({ recognizers: [recognizer] })
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
                            "title": "Welcome to Mercer Bot!",
                            "subtitle": "What can i help you with?",
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
                            "subtitle": "Were the informations provided to you appropriate?",
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
                            "title": "Do you have any further query?",
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

        })
        .matches('root', (session, args) => {
            var msg = {
                "type": "message",
                "attachmentLayout": "carousel",
                "text": "",
                "attachments": [
                    {
                        "contentType": "application/vnd.microsoft.card.hero",
                        "content": {
                            //"text": "Welcome to Mercer Bot! What can i help you with?",
                            "title": "Please choose one of the options you would like to get help!",
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
            }
        }
        )
        .onDefault((session) => {
            session.send(`Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.`, session.message.text);
        })
);
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