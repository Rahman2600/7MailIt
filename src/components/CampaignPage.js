import React from "react";
import "../App.css";
import scrap from '../assets/scrap.png';
import multipleUserLogo from '../assets/multipleUserLogo.png';
import userLogo from '../assets/userLogo.png';
import sendSingleEmail from '../api-service.js'
var AWS = require('aws-sdk');
var S3 = require('aws-sdk/clients/s3');
var mammoth = require("mammoth");

const BUCKET_NAME = "docxtemplates"

const EMAIL_FORMAT_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

AWS.config.update(
    {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
);

class CampaignPage extends React.Component {
    constructor(props) {
        super(props);
        this.messages = Object.freeze({
            INCORRECT_EMAIL_FORMAT:   "Email Address is incorrectly formatted. Please provide a correctly formatted email and try again.",
            EMPTY_FIELD:  "At least one field is empty. Please fill all inputs above and try again.",
            SUCCESS: "Sucessfully sent email file",
            SINGLE_EMAIL_ERROR: "The following response was recieved when trying to send your email: "
        });
        this.state = { 
            templateKey: this.props.match.params.templateKey,
            docHtml: '', 
            dynamicValues: this.props.location.state.dynamicValues,
            templateName: this.props.location.state.templateName,
            emailAddress: '' ,
            message: null}
        
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <div className="container-fluid my-container">
                <div className="row my-rows" style={{ textAlign: 'center' }}>
                    <div className="col-6 my-col">Preview Template</div>
                    <div className="col-6 my-col">Create Email Campaign</div>
                </div>
                <div className="row my-rows">
                    <div className="col-6 my-col img-responsive" dangerouslySetInnerHTML={{ __html: this.state.docHtml }} />
                    <div className="col-6 my-col">
                        <div className="row my-row1"></div>
                        <div className="row justify-content-space-evenly my-row">
                            <img src={userLogo} className="img-rounded" width="30" height="30" />
                        </div>
                        <div className="form-group">
                            <div className="row justify-content-space-evenly my-row2">
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">Single Email Address</span>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email-address"
                                        className="form-control" 
                                        aria-label="EmailAddress" 
                                        onChange={this.handleEmailChange} 
                                        required>
                                    </input>
                                </div>
                            </div>
                            {this.state.dynamicValues.length > 0 ? 
                            <div className="row justify-content-space-evenly my-row2">
                                Dynamic Values
                                <div className="input-group mb-3">
                                    {this.createDynamicValueTextFields()}
                                </div>
                            </div> : null }
                        </div>
                        <div className="row justify-content-right my-row1">
                                <button type="button" className="btn btn-success" id='button1' onClick={this.handleSubmit}>Submit</button>
                        </div>
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
                        <div className="row my-row1"></div>
                        <div className="row justify-content-space-evenly my-row">
                            <img src={multipleUserLogo} className="img-rounded" width="50" height="50" />
                        </div>
                        Coming Soon!
                        <div className="row justify-content-space-evenly my-row2">
                            <div className="input-group mb-3">
                                <div className="custom-file">
                                    <input type="file" className="custom-file-input" id="inputGroupFile02" />
                                    <label className="custom-file-label" for="inputGroupFile02">CSV File Upload</label>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-space-evenly my-row2">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-default">Subject Line</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                            </div>
                        </div>
                        
                        <div className="row justify-content-left my-row1">
                            <img src={scrap} className="img-rounded" width="50" height="50" />
                            <button type="button" className="btn btn-danger">Remove Template</button>
                            Coming Soon!
                        </div>
                        <div className="row justify-content-right my-row1">
                            <button type="button" className="btn btn-success" id='button2'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        var s3 = new AWS.S3();
        s3.getObject({ Bucket: BUCKET_NAME, Key: this.state.templateKey }, (err, data) => {
            if (err) {
                console.log(err);
                throw err
            }
            mammoth.convertToHtml({ arrayBuffer: data.Body }).then((v, m) => {
                this.setState({ docHtml: v.value });
            });
        });
    }

    createDynamicValueTextFields() {
        let dynamicValueTextInputs = []
        for (var dynamicValue of this.state.dynamicValues ) {
            let textInput = 
                <div key={dynamicValue} className="input-group mb-1">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id={dynamicValue}>{dynamicValue}</span>
                    </div>
                    <input 
                        type="text" 
                        className="single-email form-control" 
                        aria-label={dynamicValue} 
                        onChange={this.handleInputChange} 
                        required></input>
                </div>
            dynamicValueTextInputs.push(textInput);
        }
        return dynamicValueTextInputs;
    }

    handleEmailChange(event) {
        console.log(event);
        this.setState({emailAddress: event.target.value});
    }

    handleInputChange(event) {
        var dynamicValueName = event.target.getAttribute('aria-label');
        let dynamicValueObject = {};
        dynamicValueObject[dynamicValueName] = event.target.value;
        this.setState(dynamicValueObject);
    }

    handleSubmit(event) {
        let dynamicValueInputs = document.getElementsByClassName('single-email');
        let emailAddressInput = document.getElementById('email-address');
        let dynamicValueObject = {};
        let emptyField = false;
        let incorrectlyFomattedEmail = false;
        let emailAddress = this.state['emailAddress'];
        console.log(emailAddress);
        //Validate Email is of the correct format
        if(this.isEmptyStringOrNull(emailAddress)) {
            emailAddressInput.classList.add("inputError");
            emptyField = true;
        } 
        if(!this.isEmailCorrectlyFormatted(emailAddress)) {
            emailAddressInput.classList.add("inputError");
            incorrectlyFomattedEmail = true;
        } else {
            emailAddressInput.classList.remove("inputError");
        }
        
        //Validate Dynamic Value Inputs are correctly formatted
        for(var input of dynamicValueInputs) {
            var dynamicValue = input.getAttribute("aria-label");
            if(this.isEmptyStringOrNull(this.state[dynamicValue])) {
                input.classList.add("inputError");
                emptyField = true;
            } else {
                input.classList.remove("inputError");
                dynamicValueObject[dynamicValue] = input.value;
            }

        }

        if(!incorrectlyFomattedEmail && !emptyField) {
            this.setState({message: null});
            var header = { headers: {
                "x-api-key": "6oyO3enoUI9Uu26ZPtdXNA2YPPCbSWn2cFRrxwRh"
            }};

            var body = {
                emailAddress: emailAddress,
                dynamicValueStrings: JSON.stringify(dynamicValueObject),
                templateId: this.state.templateName
            };
            sendSingleEmail(header, body).then(response => {
                if(response.status === 200) {
                    this.setState({ message: this.messages.SUCCESS })
                } else {
                    console.log(response);
                    this.setState({ message: this.messages.SINGLE_EMAIL_ERROR + response.data})
                }
            }).catch(err => {
                this.setState({ message: this.messages.SINGLE_EMAIL_ERROR + err})
            })
            
        } else if(emptyField){
            this.setState({ message: this.messages.EMPTY_FIELD });
        } else if(incorrectlyFomattedEmail) {
            this.setState({ message: this.messages.INCORRECT_EMAIL_FORMAT })
        }

    }

    isEmailCorrectlyFormatted(email) {
        return email.match(EMAIL_FORMAT_REGEX);

    
    }

    isEmptyStringOrNull(string) {
        return string == null || string === "";
    }

}
export default CampaignPage;
