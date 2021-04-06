import React from "react";
import {createBatchEmailCampaign} from "../aws_util";
import scrap from '../assets/scrap.png';
import multipleUserLogo from '../assets/multipleUserLogo.png';
import { Link } from "react-router-dom";

class BatchEmailCampaignCreation extends React.Component {
	constructor(props) {
		super(props);
		this.state = { templateName: props.templateName, dynamicValues: props.dynamicValues, selectedFile: '', subjectLine: '', message: null, loading: false};
		this.messages = Object.freeze({
            WRONG_FILE_TYPE:   "The file does not have the correct type. Please upload a .csv file",
            BATCH_EMAIL_CREATION_FAIL:  "An error occured when creating the batch email campaign: ",
            EMPTY_FIELD: "There is at least one empty field. Please upload a correctly formatted .csv file and provide a subject line to continue.",
            SUCCESS: "Sucessfully created a batch email campaign."
        });

		this.onFileUpload = this.onFileUpload.bind(this);
        this.onSubjectLineChange = this.onSubjectLineChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		return (
			<div>
				<div className="row my-row1"></div>
				<div className="row justify-content-space-evenly my-row">
					<img src={multipleUserLogo} className="img-rounded" width="50" height="50" />
				</div>
				<div className="row my-row1">
					{"Please submit a .csv file formatted similar to this :"}
					<Link to="/Example_File.csv" target="_blank" download>{"example file."}</Link>
				</div>
				<div className="row justify-content-space-evenly my-row1">
					<div className="input-group mb-3">
						
                	<form>
                    	<div className="form-group">
                        	<input type="file" className="form-control-file" id="fileUploadButton" onChange={this.onFileUpload}/>
                    	</div>
               		</form>
					</div>
				</div>
				<div className="row justify-content-space-evenly my-row1">
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
						onClick={this.onSubmit}>Submit</button>
				</div>
				{this.state.loading ? 
                    <div className="horizontal-center">
                        <div className="spinner-border text-primary" style={{width: "2rem", height: "2rem"}}
                            role="status">
                        </div>
                    </div>: null
                }
				{this.state.message != null ? 
					<div id={
                        	this.state.message === this.messages.SUCCESS ? "emailSentAlert" : "emailSentFailed" }
                        className={
                            this.state.message === this.messages.SUCCESS ? "alert alert-success" : "alert alert-danger" } 
                            role="alert">
                            {`${this.state.message}`} 
                    </div>
                    :
                    <div></div>
                }
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
        let emptySubjectLine = false;
        let subjectLine = this.state['subjectLine'].trimEnd();
		
		if(this.isEmptyStringOrNull(subjectLine)) {
            subjectLineInput.classList.add("inputError");
            emptySubjectLine = true;
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

		let templateName = this.state.templateName;

        if (!fileInput || emptySubjectLine) {
            this.setState({message: this.messages.EMPTY_FIELD});
		} else if(!allowedExtensions.exec(filePath)){    
            this.setState({message: this.messages.WRONG_FILE_TYPE});
        } else {
            this.setState({loading: true});
            createBatchEmailCampaign(fileInput, subjectLine, templateName, this.state.dynamicValues).then(() => {
                this.setState({ message: this.messages.SUCCESS, loading: false});
            }).catch(error => {
                console.log("Batch Email Campaign Error: " + error.message);
                this.setState({ message: error.message, loading: false});
            });    
        }
	}

	isEmptyStringOrNull(string) {
        return string == null || string === "";
    }
}

export default BatchEmailCampaignCreation