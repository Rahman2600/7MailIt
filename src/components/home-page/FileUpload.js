import React from "react";
import {convertToTemplate,uploadFile} from "../../aws_util"

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: '', message: null }
        this.messages = Object.freeze({
            WRONG_FILE_TYPE:   "Wrong template file type. Upload a .doc or .docx file",
            UPLOAD_FAIL:  "Upload Failure",
            NO_FILE: "Please upload an Email template document",
            SUCCESS: "Sucessfully uploaded file"
        });
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    render() {
        return (
            <div>
                <p class="mt-5 text-center">Upload New Template</p>
                {this.state.message != null ? 
                    <div 
                    className={
                        this.state.message === this.messages.SUCCESS ? "alert alert-success" : "alert alert-danger" } 
                        role="alert">
                        {`${this.state.message}`} 
                    </div>
                    :
                    <div></div>
                }
                <form>
                    <div className="form-group">
                        <input type="file" className="form-control-file" id="fileUploadButton" onChange={this.onFileChange}/>
                    </div>
                </form>
                <button className="btn btn-primary btn-block mt-5" onClick={this.onFileUpload}> Submit </button>
            </div>
        )
    }

    onFileChange(event) {
        console.log(event.target.files[0]);
        this.setState({ selectedFile: event.target.files[0] });
    }

    onFileUpload() {
        var allowedExtensions = /(\.doc|\.docx)$/i;
        var fileInput = this.state.selectedFile;
        var filePath;

        if (fileInput) {
            filePath = fileInput.name;
        }

        if (!fileInput) {
            this.setState({message: this.messages.NO_FILE });
        } else if(!allowedExtensions.exec(filePath)){    
            this.setState({message: this.messages.WRONG_FILE_TYPE });
        } else {
            uploadFile(fileInput, 'docxtemplates').then(() => {
                this.setState({ message: this.messages.SUCCESS });
                //TODO: This is a temporary solution to have the newly uploaded template appear on the grid 
                //Need a more sophisticated solution 
                //window.location.reload();
            }).catch(error => {
                console.log(error);
                this.setState({ message: this.messages.UPLOAD_FAIL + error });
            });    
        }
            
    }
}

export default FileUpload;