import React from "react";
import {convertToTemplate,uploadFile} from "../../aws_util"

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: '', templateName:'', message: null, uploading: false}
        this.messages = Object.freeze({
            WRONG_FILE_TYPE:   "Wrong template file type. Upload a .doc or .docx file",
            UPLOAD_FAIL:  "Upload Failure",
            EMPTY_FIELD: "At least one field is empty. Please fill in both fields to continue.",
            TEMPLATE_NAME_INCORRECT_FORMAT: "The template name can only contain alpha numeric characters, underscores and/or hyphens",
            EMPTY_TEMPLATE_NAME: "The template name is empty. Please provide a template name to continue.",
            SUCCESS: "Sucessfully uploaded file"
        });
        this.onFileChange = this.onFileChange.bind(this);
        this.onTemplateNameChange = this.onTemplateNameChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
    }

    render() {
        return (
            <div>
                <div className="row my-row1"></div>
                <p className="mt-5 text-center">Upload New Template</p>
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
                {this.state.uploading ? 
                    <div className="horizontal-center">
                        <div className="spinner-border text-primary" style={{width: "3rem", height: "3rem"}}
                        role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> :
                    <div></div>
                }
                <form>
                    <div className="form-group">
                        <input type="file" className="form-control-file my-row2" id="fileUploadButton" onChange={this.onFileChange}/>
                    </div>
                    <div className="row justify-content-space-evenly my-row2">
                        <div className="input-group mb-2">
                            <div className="input-group-prepend">
                                <span className="input-group-text">Template Name</span>
                            </div>
                            <input 
                                type="text" 
                                id="template-name"
                                className="form-control" 
                                aria-label="TemplateName" 
                                onChange={this.onTemplateNameChange} 
                                required>
                            </input>
                        </div>
                    </div>
                </form>
                <button className="btn btn-primary btn-block mt-5" onClick={this.onFileUpload}> Submit </button>
            </div>
        )
    }

    onFileChange(event) {
        this.setState({ selectedFile: event.target.files[0], message: null });
    }

    onTemplateNameChange(event) {
        this.setState({ templateName: event.target.value});
    }

    onFileUpload() {
        //Validate template name
        let templateNameInput = document.getElementById('template-name');
        let isEmptyField = false;
        let isTemplateNameCorrectFormat = true;
        let templateName = this.state['templateName'];

        this.setState({message: null});
        if(this.isEmptyStringOrNull(templateName.trim())) {
            isEmptyField = true;
            templateNameInput.classList.add("inputError");
        } else {
            templateNameInput.classList.remove("inputError");
        }

        if(!this.isTemplateNameFormattedCorrectly(templateName)) {
            isTemplateNameCorrectFormat = false;
            templateNameInput.classList.add("inputError");
        } else {
            templateNameInput.classList.remove("inputError");
        }

        var allowedExtensions = /(\.docx)$/i;
        var fileInput = this.state.selectedFile;
        var filePath;

        if (fileInput) {
            filePath = fileInput.name;
        }
        
        if (!fileInput || isEmptyField) {
            this.setState({message: this.messages.EMPTY_FIELD});
        } else if(!isTemplateNameCorrectFormat) {
            this.setState({message: this.messages.TEMPLATE_NAME_INCORRECT_FORMAT});
        }else if(!allowedExtensions.exec(filePath)){    
            this.setState({message: this.messages.WRONG_FILE_TYPE});
        } else {
            this.setState({uploading: true});
            uploadFile(fileInput, 'docxtemplates', templateName).then(() => {
                this.setState({ message: this.messages.SUCCESS, uploading: false});
                this.props.onUploadSuccess();
            }).catch(error => {
                console.log(error);
                this.setState({ message: this.messages.UPLOAD_FAIL + ": " + error.message, uploading: false});
            });    
        }
    }

    isEmptyStringOrNull(string) {
        return string == null || string === "";
    }

    isTemplateNameFormattedCorrectly(string) {
        let templateNameRegex = /^[\-\w]*$/;
        return templateNameRegex.test(string);
    }
}

export default FileUpload;