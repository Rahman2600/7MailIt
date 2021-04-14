const AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
  
  console.log("Received event:", JSON.stringify(event, null, 2));
  
  // Specify the region of the AWS environment 
  AWS.config.update({region: 'us-east-1'});

  // Add log of the template into the dynamodb
  var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    
  // Parse the SNS event message
  var message = event.Records[0].Sns.Message;
  var SESMessage = JSON.parse(message);
    
  console.log("Received event:", JSON.stringify(SESMessage, null, 2));
  
  // Type of SNS -> Should be 'Open'
  // Type: String
  var type = SESMessage.eventType;
  
  if(type != "Open"){
    console.log("Not Open SNS event");
  }
    
  // Email address sent to
  // Type: List
  var emailsTo = SESMessage.mail.destination;
  
  //TimeStamp
  var emailTimeStamp = SESMessage.mail.timestamp;
    
  var table = "tEmailLog";

  console.log("Date sent",new Date(emailTimeStamp).toString());
  
  for (var i = 0; i < emailsTo.length; i++) {
    var emailAddress = emailsTo[i];
    var params = {
      TableName:table,
      Key:{
        "EmailAddress": emailAddress,
        "SentDateTime": new Date(emailTimeStamp).toString()
      },
      UpdateExpression: "set OpenedStatus = :r",
      ExpressionAttributeValues:{
          ":r":"true"
      },
    };
    
    
    
    console.log("Updating the item...");
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    docClient.update(params, function(err, data) {
      if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  }
  
  callback(null, "Success");
};