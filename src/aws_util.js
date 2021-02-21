import AWS from 'aws-sdk'
import axios from 'axios'

// Enter copied or downloaded access id and secret here


// Enter the name of the bucket that you have created here


// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const uploadFile = (fileName,fileInput,BUCKET_NAME) => {
    console.log(process.env.AWS_ACCESS_KEY_ID)
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

const convertToTemplate = async (fileName, bucketName) => {
    console.log("made it top");
    try {
      const res = await axios.post(`https://q6z3mxhv9d.execute-api.us-east-1.amazonaws.com/v1/template`, {
          bucket: bucketName,
          key: fileName
      }).catch(err => {
         console.log('Template was not created successfully');
      });
      console.log("made it");
      const todos = res.data;  
      return todos;
    } catch (e) {
      console.error(e);
    }
  };
export {convertToTemplate,uploadFile}
