const AWS = require('aws-sdk');
const util = require('util');
const mammoth = require("mammoth");
const s3 = new AWS.S3({ httpOptions: { timeout: 1000 } });
const DOCX_MIME_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOCX_FILE_BASE64_ENCODING_HEADER = /^data:application\/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,/
const DOCX_BUCKET_NAME = "docxtemplates";

//Upload a docx file to S3 and create SES template 
exports.handler = async(event) => {
    AWS.config.update({ region: 'us-east-1' });

    //S3 sdk object and key to access file in future 
    var bucket = event.bucket;
    var key = event.fileName;
    var fileContent = event.content;
    var contentType = event.contentType;

    if (bucket !== DOCX_BUCKET_NAME) {
        return {
            statusCode: 404,
            body: JSON.stringify('S3 Bucket name for storing docx files is incorrect')
        }
    }

    if (key == null || key === "") {
        return {
            statusCode: 404,
            body: JSON.stringify('S3 Key not provided')
        }
    }


    if (contentType !== DOCX_MIME_TYPE) {
        return {
            statusCode: 404,
            body: JSON.stringify('The upload file is not a .docx file type: ' + event.contentType)
        }
    }

    //Remove the DOCX_FILE_BASE64_ENCODING_HEADER from the encoded docx file and create a buffer
    const buff = createDocxBuffer(fileContent);

    //Put file into S3 bucket, if an error occurs return internal server errors
    var putParams = {
        Bucket: bucket,
        Key: key,
        Body: buff,
        ContentEncoding: 'base64',
        ContentType: contentType
    };


    await s3.putObject(putParams).promise().catch((error) => {
        return {
            statusCode: 500,
            body: JSON.stringify('Error uploading file to S3: ' + error)
        }
    });

    //Convert file to html
    var resulting_html = await mammoth.convertToHtml({ buffer: buff });
    var resulting_html_string = resulting_html.value.toString().replace(/\$\{/g, "{{").replace(/\}/g, "}}");
    var text = resulting_html.value.toString().replace(/<\/?[^>]+>/ig, " ");

    //Create the email template in SES
    var templateName = key.replace(/ /g, "_").replace(".docx", "");

    var templateParams = {
        Template: {
            TemplateName: templateName,
            HtmlPart: resulting_html_string,
            SubjectPart: key,
            TextPart: text
        }
    };


    var templatePromise = await createEmailTemplateInSES(templateParams);

    //Create the Template Log in DynamoDB
    //TODO: Should this be created if there was an error uploading the email template? 
    var databaseParams = {
        TableName: 'tTemplateLog',
        Item: {
            'TemplateName': { S: templateName },
            'DynamicValues': { S: 'TODO' },
            'DocUploadDateTime': { S: new Date(Date.now()).toString() },
            'S3Key': { S: key },
            'Team': { S: 'TODO' },
            'UploadStatus': { S: 'Ready' },
        }
    };

    var databaseResponse = await createTemplateDatabaseLog(databaseParams);

    //Create the API response 
    const response = {
        statusCode: 200,
        size: buff.length,
        result: resulting_html,
        text: text,
        template: templateParams,
        promise: templatePromise,

    };

    return response;
};

const createDocxBuffer = (fileContent) => {
    const base64String = fileContent.replace(DOCX_FILE_BASE64_ENCODING_HEADER, '');
    return new Buffer(base64String, 'base64');
};

const createEmailTemplateInSES = async(templateParams) => {
    var templatePromise;

    try {
        templatePromise = await new AWS.SES({ apiVersion: '2010-12-01' }).createTemplate(templateParams).promise();
    }
    catch (err) {
        templatePromise = await new AWS.SES({ apiVersion: '2010-12-01' }).updateTemplate(templateParams).promise();
    }

    return templatePromise;
};

const createTemplateDatabaseLog = async(dbParams) => {

    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

    return new Promise((resolve, reject) => {
        ddb.putItem(dbParams, function(err, data) {
            if (err) {
                console.log("Error", err);
                reject(err);
            }
            else {
                console.log("Success", data);
                resolve(data);
            }
        });
    });

};
