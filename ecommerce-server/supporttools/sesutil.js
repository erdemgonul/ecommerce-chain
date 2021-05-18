require('dotenv').config({path:'../.env'});
const moment = require("moment");
const path = require("path");
const {resolve} = require("path");
const fs = require('fs');
const {readdir} = require("fs").promises;
const AWS = require('aws-sdk');
const util = require("util");
const process = require('process');

// Run the script
const AWSSES = new AWS.SES({region: "eu-west-1", apiVersion: '2010-12-01'});
const AWSSESv2 = new AWS.SESV2({region: 'eu-west-1', apiVersion: '2019-09-27'});

const TEMPLATES_FOLDER_PATH = `${process.cwd()}\\emailtemplates`;

const SAMPLE_EMAIL_RECIPIENT_ADDRESS = "ertan.ayanlar@invstr.com";
const SAMPLE_EMAIL_RECIPIENT_NAME = "Ertan Ayanlar";

const SAMPLE_EMAIL_TEMPLATE_DATA = {
    "recipient_name": SAMPLE_EMAIL_RECIPIENT_NAME,
};

/*
var sts = new AWS.STS();
sts.getCallerIdentity({}, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log(JSON.stringify(data));
    }
}); */

Execute();

async function Execute() {
    const startedOn = moment();
    let filesCount = 0;
    let succedded = 0;
    let failed = 0;
    let updated = 0;
    let created = 0;
    let mailsent = 0;

    try {
        for await (const f of GetFiles(TEMPLATES_FOLDER_PATH)) {
            console.log("\n");
            console.log(path.basename(f));
            console.log(f);

            filesCount++;

            let templateName = path.basename(f);
            if (templateName) {
                templateName= templateName.replace(path.extname(f), "").trim();     //.toUpperCase();
                console.log(`Template Name: ${templateName}`);
            }

            let html = fs.readFileSync(f, 'utf8');

            let title = html.match(/<title>(.*?)<\/title>/gmi);


            if (Array.isArray(title)) {
                title = title[0].substr("<title>".length, title[0].length - "<title></title>".length).trim();

                // trim double spaces
                title = title.replace(/  +/g, ' ');

                console.log(`Title: ${title}`);

            }
            else
                console.error(`\tNo title found!`);

            // Create the SES template

            if (title && templateName) {

                let resp = await GetTemplate(templateName);

                if (resp) {

                    let resp = await UpdateTemplate(templateName, title, html);

                    if (resp && resp.ResponseMetadata && resp.ResponseMetadata.RequestId) {
                        console.log(`\tTemplate updated`);

                        updated++;
                        succedded++;

                        resp = await SendTestEmail(templateName);
                        if (resp && resp.MessageId) {
                            console.log(`\tA test email sent to "${SAMPLE_EMAIL_RECIPIENT_ADDRESS}"`);
                            mailsent++;
                        }

                    }
                    else {
                        console.log(`Template update is failed!\n${util.inspect(resp)}`);
                        failed++;
                    }

                }
                else {

                    let resp = await CreateTemplate(templateName, title, html);

                    if (resp && resp.ResponseMetadata && resp.ResponseMetadata.RequestId) {
                        console.log(`\tTemplate created`);

                        created++;
                        succedded++;

                        resp = await SendTestEmail(templateName);
                        if (resp && resp.MessageId) {
                            console.log(`\tA test email sent to "${SAMPLE_EMAIL_RECIPIENT_ADDRESS}"`);
                            mailsent++;
                        }
                    }
                    else {
                        console.log(`Template creation is failed!\n${util.inspect(resp)}`);
                        failed++;
                    }

                }

            }

        }

    }
    catch (err) {
        console.error(util.inspect(err));
    }
    finally {
        console.log(`${"-".repeat(100)}`);

        console.log(`\nListed files : ${filesCount}`);

        console.log(`\nTemplate create/update succeeded : ${succedded}`);
        console.log(`Template create/update failed: ${failed}`);
        console.log(`Updated templates: ${updated}`);
        console.log(`Created templates: ${created}`);
        console.log(`Sent test emails: ${mailsent}`);

        console.log(`\nFolder path of the templates: ${TEMPLATES_FOLDER_PATH}`);
        console.log(`Sample email recipient: ${SAMPLE_EMAIL_RECIPIENT_ADDRESS}`);
        console.log(`Sample email template data: ${JSON.stringify(SAMPLE_EMAIL_TEMPLATE_DATA)}`);
        console.log(`\nCompleted in ${moment().diff(startedOn, "seconds")} seconds`);

        process.exit(1);
    }

}

async function GetTemplate(templateName) {
    try {

        let resp = await AWSSES.getTemplate({TemplateName: templateName}).promise();

        if (resp && resp.Template)
            return resp.Template;
        else
            return;

    }
    catch (e) {
        if (e.code !== "TemplateDoesNotExist") {
            console.error(util.inspect(e));
            return;
        }
    }

}

async function CreateTemplate(templateName, subject, body) {
    let params = {
        Template: {
            TemplateName: templateName,
            SubjectPart: subject,
            HtmlPart: body
        }
    };

    let resp = await AWSSES.createTemplate(params).promise();

    return resp;
}

async function UpdateTemplate(templateName, subject, body) {
    let params = {
        Template: {
            TemplateName: templateName,
            SubjectPart: subject,
            HtmlPart: body
        }
    };

    let resp = await AWSSES.updateTemplate(params).promise();

    return resp;
}

async function SendTestEmail(templateName) {
    let params = {
        "Content": {
            "Template": {
                "TemplateName": templateName,
                "TemplateData": JSON.stringify(SAMPLE_EMAIL_TEMPLATE_DATA)
            }
        },
        "Destination": {
            "ToAddresses": [
                SAMPLE_EMAIL_RECIPIENT_ADDRESS
            ]
        },
        "FromEmailAddress": `EcommerceChain Team <ecommercechanozu@gmail.com>`,
        "ReplyToAddresses": [`ecommercechanozu@gmail.com`]
    };

    let resp = await AWSSESv2.sendEmail(params).promise();

    return resp;
}

async function* GetFiles(dir) {
    const dirents = await readdir(dir, {withFileTypes: true});

    for (const dirent of dirents) {

        const res = resolve(dir, dirent.name);

        if (dirent.isDirectory()) {
            yield* GetFiles(res);
        }
        else {
            if (path.extname(res) === ".html")
                yield res;
        }

    }
}

