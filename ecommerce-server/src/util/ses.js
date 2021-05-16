const AWS = require('aws-sdk');
const https = require('https');

AWS.config.logger = console;

const SESV2 = new AWS.SESV2({
    apiVersion: '2019-09-27',
    region: process.env.AWS_REGION,
    endpoint: 'email.eu-west-1.amazonaws.com',
    maxRetries: 3,
    retryDelayOptions: {
        base: 100
    },
    httpOptions: {
        agent: new https.Agent({
            keepAlive: true,
            rejectUnauthorized: true,
            maxSockets: 50,
            secureProtocol: 'TLSv1_2_method',
            ciphers: "ALL"
        })
    }
});

/***
 * Deliveries an email by using AWS SES service.
 *
 * @param userOrAdresses
 * @param template
 * @param templateData
 * @param paramOptions
 * @constructor
 */
exports.SendEmailWithTemplate = function (userOrAdresses, template, templateData, paramOptions = {}) {
    if (!Array.isArray(userOrAdresses) && typeof userOrAdresses === "object") {
        userOrAdresses = userOrAdresses.email;
    }

    console.log(`SendEmailWithTemplate :: toAddresses: ${JSON.stringify(userOrAdresses)} :: template: ${template} :: templateData: ${JSON.stringify(templateData)}`);

    if (userOrAdresses && typeof userOrAdresses === "string")
        userOrAdresses = [userOrAdresses];

    if (templateData && typeof templateData === "object")
        templateData = JSON.stringify(templateData);

    let params = {
        "Destination": {
            "ToAddresses": userOrAdresses
        },
        "Content": {
            "Template": {
                "TemplateName": template,
                "TemplateData": templateData
            }
        },
        "FromEmailAddress": `EcommerceChain Team <ecommercechanozu@gmail.com>`,
        "ReplyToAddresses": [`ecommercechanozu@gmail.com`]
    };

    // Add optional parameters

    if (paramOptions) {

        if (paramOptions.FromEmailAddress)
            params.FromEmailAddress = paramOptions.FromEmailAddress;

        if (paramOptions.ReplyToAddresses)
            params.ReplyToAddresses = [paramOptions.ReplyToAddresses];

        if (paramOptions.ContactListName)
            params.ListManagementOptions.ContactListName = [paramOptions.ContactListName];

        if (paramOptions.TopicName)
            params.ListManagementOptions.TopicName = [paramOptions.TopicName];

    }

    // Create the promise and SES service object

    let sendPromise = SESV2.sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states

    sendPromise.then(
        function (data) {
            console.log(`${JSON.stringify(userOrAdresses)} e-mail has sent. Response: ${JSON.stringify(data)}`);

        }).catch((err) => {

        console.log(`${JSON.stringify(userOrAdresses)} e-mail delivery failed! Response: ${JSON.stringify(err)}`);
    });
};
