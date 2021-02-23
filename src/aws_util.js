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

const uploadFile = (fileName,fileInput,BUCKET_NAME) => {
    // read content from the file
    const fileContent = fileInput;

    // setting up s3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // file name you want to save as
        Body: fileContent
    };
    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err
        }
        console.log(`File uploaded successfully. ${data.Location}`)
    });
};

//convertToTemplate() - TODO for Matt.
const convertToTemplate = async () => {
    try {
      const res = await axios.put(`website/endpoint`);
      const todos = res.data;  
      return todos;
    } catch (e) {
      console.error(e);
    }
  };
export {convertToTemplate,uploadFile}
