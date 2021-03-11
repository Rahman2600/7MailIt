import AWS from 'aws-sdk'
import axios from 'axios'
import fs from 'fs'

const uploadFile = async (fileName,fileInput,BUCKET_NAME) => {
    // read content from the file
    var fileBase64String = await encodeFileAsBase64String(fileInput);
    var fileType = fileInput.type;
    // setting up s3 upload parameters
    try {
     var header = { headers: {
        "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_API_KEY
     }};

    var body = {
        bucket: BUCKET_NAME,
        fileName: fileName,
        content: fileBase64String,
        contentType: fileType
    };

    //Create and send API request to /template endpoint
    const res = await axios.post(`https://q6z3mxhv9d.execute-api.us-east-1.amazonaws.com/v1/template`, 
                                    body, header);
        //TODO: This is a temporary solution to have the newly uploaded template appear on the grid 
        //Need a more sophisticated solution 
        window.location.reload();
    } catch (e) {
      console.error(e);
    }
    
};

const encodeFileAsBase64String = async (fileInput) => {
   return new Promise((resolve, reject) => {
        try {

            let reader = new FileReader();
            reader.onload = function() {
                if(reader.readyState === FileReader.DONE) {
                    resolve(reader.result);
                }
            };
            reader.readAsDataURL(fileInput);
        } catch(err) {
            reject(err);
        }
   });
};

export {uploadFile}
