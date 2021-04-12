var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});

//Send an email campaign - Single email
exports.handler = (event, context, callback) => {
    //Parse the body for necessary values 
    var body = JSON.parse(event.body);
    var emailAddress = body.emailAddress;
    //TODO remove this for testing purposes 
    console.log("Dynamiv String Values:",body.dynamicValueStrings);
    var dynamicValueStrings = body.dynamicValueStrings; // can we pass the key, value pair instead
    // //{ \"REPLACEMENT_TAG_NAME\":\"REPLACEMENT_VALUE\" }'
    var templateName = body.templateId;
    //var emailAddress = 'corbynkwan@gmail.com';
    const unsubscribeLink = "https://962k5qfgt3.execute-api.us-east-1.amazonaws.com/v1/unsubscribe-from-ses/" + emailAddress;
    // REWROTE to BELOW var dynamicValueStrings = '{ \"NAME\":\"Jenn\", \"AMOUNT\":\"$3000\", \"PROMO_CODE\":"{{unsubscribeLink}}" }';
    // const dynamicValueStrings = { 
    //     "NAME":"Jenn", 
    //     "AMOUNT":"$3000", 
    //     "PROMO_CODE": "promotest",
    //     "UNSUBSCRIBE_LINK": unsubscribeLink
    // };
    //Old tempalteId = 'BasicTemplate_withImage';
    //var tempalteId = 'unsubscribe_test';  
    //var templateName = body.templateId;
    //var emailAddress = 'jenncscampbell@gmail.com';
    //var dynamicValueStrings = '{ \"NAME\":\"Jenn\", \"AMOUNT\":\"$3000\", \"PROMO_CODE\":"{{unsubscribeLink}}" }';
    
    // Load the AWS SDK for Node.js
    
    var params = {
      Destination: { 
        CcAddresses: [
        ],
        ToAddresses: [
          emailAddress
        ]
  
      },
      ConfigurationSetName:"DeliveryNotice",
      Source: 'Mountainsasquatch00@gmail.com',
      Template: templateName, /* change after */ 
      TemplateData: dynamicValueStrings,
      ReplyToAddresses: [],
    };
    
    var response;
    var sesResponse = new Promise(function(resolve, reject) {
        ses.sendTemplatedEmail(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("SES:",ses)
                console.log("DATA:",data);
                resolve(data);
            }
        });
    });
    
    //TODO: Need to figure out how to handle failed emails
    sesResponse.then(data => {
        createDatabaseLog(emailAddress, templateName, dynamicValueStrings);
        var response = {
            "statusCode": 200,
            "isBase64Encoded": false,
            "body": JSON.stringify("Email Sent successfully")
        };
        callback(null, response);
        
    }).catch( error => {
        //TODO should there be a email log created here
        var response = {
            "statusCode": 500,
            "isBase64Encoded": false,
            "body": JSON.stringify("Email Did Not Sent successfully " + error)
        };
        callback(null, response);
    });
};

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