import React from "react";

class BatchEmailCampaignCreation extends React.Component {
	constructor(props) {
		super(props);
		this.state = { templateName: props.templateName, selectedFile: '', subjectLine: '', message: null, loading: false};
		this.messages = Object.freeze({
            WRONG_FILE_TYPE:   "Wrong template file type. Upload a .csv file",
            BATCH_EMAIL_CREATION_FAIL:  "An error occured when creating the batch email campaign. Please refer to the console for more details.",
            NO_FILE: "Please upload a correctly formatted .csv file.",
            SUCCESS: "Sucessfully created a batch email campaign."
        });

		this.onFileUpload = this.onFileUpload.bind(this);
        this.onSubjectLineChange = this.onBatchEmailSubjectLineChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<div>
				<div className="row my-row1"></div>
				<div className="row justify-content-space-evenly my-row">
					<img src={multipleUserLogo} className="img-rounded" width="50" height="50" />
				</div>
				<div className="row justify-content-space-evenly my-row2">
					<div className="input-group mb-3">
						<div className="custom-file">
							<input 
								type="file" 
								className="custom-file-input" 
								id="inputGroupFile02" 
								onChange={this.onFileUpload}/>
							<label className="custom-file-label" for="inputGroupFile02">CSV File Upload</label>
						</div>
					</div>
				</div>
				<div className="row justify-content-space-evenly my-row2">
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="inputGroup-sizing-default">Subject Line</span>
						</div>
						<input 
							type="text" 
							id="subject-line-batch-email" 
							className="form-control" 
							aria-label="subjectLineBatch" 
							aria-describedby="inputGroup-sizing-default" 
							onChange={this.onSubjectLineChange}
							required/>
					</div>
				</div>

				{/* <div className="row justify-content-left my-row1">
					<img src={scrap} className="img-rounded" width="50" height="50" />
					<button type="button" className="btn btn-danger">Remove Template</button>
					Coming Soon!
				</div> */}
				<div className="row justify-content-right my-row1">
					<button 
						type="button" 
						className="btn btn-success" 
						id='button2'
						onClick={this.onFileUpload}>Submit</button>
				</div>
			</div>
		);
	}

	onFileUpload(event) {
        this.setState({ selectedFile: event.target.files[0], message: null });
	}

	onSubjectLineChange(event) {
		this.setState({subjectLine: event.target.value});
	}

	onSubmit(event) {
        //Validate Subject Line
		let subjectLineInput = document.getElementById('subject-line-batch-email');
        let emptyField = false;
        let subjectLine = this.state['subjectLine'].trimEnd();
		
		if(this.isEmptyStringOrNull(subjectLine)) {
            subjectLineInput.classList.add("inputError");
            emptyField = true;
        } else {
            subjectLineInput.classList.remove("inputError");
        }

		//Validate File
		let allowedExtensions = /(\.csv)$/i;
        let fileInput = this.state.selectedFile;
        let filePath;

        if (fileInput) {
            filePath = fileInput.name;
        }

        if (!fileInput) {
            this.setState({message: this.messages.NO_FILE});
        } else if(!allowedExtensions.exec(filePath)){    
            this.setState({message: this.messages.WRONG_FILE_TYPE});
        } else {
            this.setState({uploading: true});
            uploadFile(fileInput, 'docxtemplates').then(() => {
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
}

export default BatchEmailCampaignCreation