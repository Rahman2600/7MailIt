import AWS from 'aws-sdk'
import axios from 'axios'

// Enter copied or downloaded access id and secret here


// Enter the name of the bucket that you have created here


// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
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

    // Uploading files to the bucket
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
        "x-api-key": "lvzGHPPiCF5H0RHg23ZS2wjFwMtaLig6KlYC7vP2"
     }};
     var body = {
          bucket: bucketName,
          key: fileName
      };
      const res = await axios.post(`https://q6z3mxhv9d.execute-api.us-east-1.amazonaws.com/v1/template`, 
                                    body, header).catch(err => {
         console.error('Template was not created successfully', err);
      });
      const todos = res.data;  
      return todos;
    } catch (e) {
      console.error(e);
    }
};

export {convertToTemplate,uploadFile}
