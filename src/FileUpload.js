import React from "react";
import uploadFile from "./aws_util"

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: '', error: null }
        this.errors = Object.freeze({
            WRONG_FILE_TYPE:   "Wrong template file type. Upload a .doc or .docx file",
            UPLOAD_FAIL:  "Upload Failure",
            NO_FILE: "Please upload an Email template document"
        });
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    render() {
        return (
            <div>
                <button className="btn btn-light btn-block mt-5" onClick={this.onFileUpload}> Upload New Template </button>
                {this.state.error != null ? 
                    <div className="alert alert-danger" role="alert">
                        {`Error: ${this.state.error}`} 
                    </div>
                    :
                    <div></div>
                }
                <form>
                    <div className="form-group">
                        <input type="file" className="form-control-file" id="file" onChange={this.onFileChange}/>
                    </div>
                </form>
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
            this.setState({error: this.errors.NO_FILE });
        } else if(!allowedExtensions.exec(filePath)){    
            this.setState({error: this.errors.WRONG_FILE_TYPE });
        } 
        // else {
        //     this.setState({ error: null });
        // }
        uploadFile(filePath);

    }
}

export default FileUpload;