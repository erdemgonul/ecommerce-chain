const AWS = require('aws-sdk');
const https = require('https');

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

const {EMAIL_SENDER_ADDRESS} = process.env;

module.exports.handle = async (event) => {
    const email = event.email;

    try {
        const result = await sendEmail(email);
        console.log(`${JSON.stringify(event)} e-mail has sent. Response: ${JSON.stringify(result)}`);
        return true;
    }  catch (err) {
        console.log(`${JSON.stringify(event)} e-mail delivery failed! Response: ${JSON.stringify(err)}`);
        throw err;
    }
};

function sendEmail(email) {
    if (email.templateData && typeof email.templateData === "object")
        email.templateData = JSON.stringify(email.templateData);

    const params = {
        "Destination": {
            "ToAddresses": email.to
        },
        "Content": {
            "Template": {
                "TemplateName": email.templateName,
                "TemplateData": email.templateData
            }
        },
        "FromEmailAddress": `EcommerceChain Team <ecommercechanozu@gmail.com>`,
        "ReplyToAddresses": [`ecommercechanozu@gmail.com`]
    };

    return SESV2.sendEmail(params).promise();
}
