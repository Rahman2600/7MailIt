import AWS from 'aws-sdk'
import axios from 'axios'

// Enter copied or downloaded access id and secret here


// Enter the name of the bucket that you have created here


// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
});

const uploadFile = async (fileName,fileInput,BUCKET_NAME) => {
    // read content from the file
    const fileContent = fileInput;
    
    // setting up s3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // file name you want to save as
        Body: fileContent
    };

    /* Uploading files to the bucket
    * This needs to be wrapped in a promise to ensure that the file upload is complete 
    * before any subsequent process can be initiated.
    */
    return new Promise(function (resolve, reject) {
        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`)
            resolve();
        });
    });
    
};

const convertToTemplate = async (fileName, bucketName) => {
    
    try {
     var header = { headers: {
        "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_API_KEY
     }};

     var body = {
          bucket: bucketName,
          key: fileName
      };

      //Create and send API request to /template endpoint
      const res = await axios.post(`https://q6z3mxhv9d.execute-api.us-east-1.amazonaws.com/v1/template`, 
                                    body, header);
      /*TODO: Below is placeholder code to implement after the email template log
      * grid is integrated with all stored email template logs in dynamodb
      */
      const todos = res.data;  
      return todos;
    } catch (e) {
      console.error(e);
    }
};

export {convertToTemplate,uploadFile}
