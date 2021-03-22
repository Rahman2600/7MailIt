var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});
var s3 = new aws.S3({httpOptions: {timeout: 30000}});
const fs = require('fs');
const csv = require('csv-parser');

//Send Batch emails with an uploaded csv file - First Draft with hard coded values    
exports.handler = async (event, context, callback) => {
    
    var data = await getCSVData();
    var result = data;
    var tempalteId = 'BasicTemplate_withSingleImage';    
    
    var params = {
      Destinations: generateDestinationObjects(result),
      Source: 'Mountainsasquatch00@gmail.com',
      Template: tempalteId, 
      DefaultTemplateData: '{"NAME":"Default","AMOUNT":"Default","PROMO_CODE":"Default"}' 
    };
    
    var sesResponse = new Promise(function(resolve, reject) {
        ses.sendBulkTemplatedEmail(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    });
    
    return sesResponse.then(data => {
        result.map((entry) => {
            createDatabaseLog(entry["Email Address"], tempalteId, getDynamicValueStrings(entry))
        })
        var response = {
            "statusCode": 200,
            "isBase64Encoded": false,
            "body": JSON.stringify("Email Sent successfully " + data)
        };
        callback(null, response);
        
    }).catch( error => {
        var response = {
            "statusCode": 500,
            "isBase64Encoded": false,
            "body": JSON.stringify("Email Did Not Sent successfully " + error)
        };
        callback(null, response);
    });
    
};

function getCSVData() {
    let entries = [];
    var params_s3_get_object = {
        Bucket: 'csvfilesemailcampaign',
        Key: 'BulkEmail.csv'
    }

    return new Promise((resolve, reject) => {
        s3.getObject(params_s3_get_object).createReadStream().pipe(csv())
        .on('data', (row) => {
            entries.push(row);
        })
        .on('end', () => {
            resolve(entries);
        })
    })
}
        

function generateDestinationObjects(jsonData) {
   return jsonData.map((entry) => {
       let emailAddress = entry["Email Address"];
       if (!validateEmail(emailAddress)) {
           throw `Error: invalid email address: ${emailAddress}`
       }
       return {
           Destination: {
               ToAddresses: [ 
                   emailAddress 
               ]
           },
           ReplacementTemplateData: getDynamicValueStrings(entry)
       }
   })
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function createDatabaseLog(emailAddress, templateName, dynamicValueStrings) {
    var ddb = new aws.DynamoDB({apiVersion: '2012-08-10'});
    
    var params = {
          TableName: 'tEmailLog',
          Item: {
            'EmailAddress': {S: emailAddress},
            'SentDateTime' : {S: new Date(Date.now()).toString()},
            'TemplateName' : {S: templateName},
            'DynamicValues' : {S: dynamicValueStrings},
            'DeliveryStatus' : {S: "false"},
            'OpenedStatus' : {S: "false"},
            'ClickedLinkStatus': {S: "false"}
          }
        };
        
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error creating email log", err);
      } else {
        console.log("Success creating email log");
      }
    });    
}

function getDynamicValueStrings(entry) {
    let newEntry = {}
    for (let [key, value] of Object.entries(entry)) {
        if (key != "Email Address") {
            newEntry[key] = value;
        }
    }
    return JSON.stringify(newEntry);
}





