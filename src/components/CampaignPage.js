import React from "react";
import "../App.css";
import scrap from '../assets/scrap.png';
import multipleUserLogo from '../assets/multipleUserLogo.png';
import userLogo from '../assets/userLogo.png';
var AWS = require('aws-sdk');
var S3 = require('aws-sdk/clients/s3');
var mammoth = require("mammoth");

const BUCKET_NAME = "docxtemplates"

AWS.config.update(
    {
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    }
);

class CampaignPage extends React.Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = { 
            templateKey: this.props.match.params.templateKey,
            docHtml: '', 
            dynamicValues: this.props.location.state }
    }

    render() {
        return (
            <div className="container-fluid my-container">
                <div className="row my-rows" style={{ textAlign: 'center' }}>
                    <div className="col-6 my-col">Preview Template</div>
                    <div className="col-6 my-col">Create Template</div>
                </div>
                <div className="row my-rows">
                    <div className="col-6 my-col img-responsive" dangerouslySetInnerHTML={{ __html: this.state.docHtml }} />
                    <div className="col-6 my-col">Parameter List: {this.state.dynamicValues}
                        <div className="row my-row1"></div>
                        <div className="row justify-content-space-evenly my-row">
                            <img src={userLogo} className="img-rounded" width="30" height="30" />
                        </div>
                        <div className="row justify-content-space-evenly my-row2">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Single Email Address</span>
                                </div>
                                <input type="text" className="form-control" aria-label="EmailAddress"></input>
                            </div>
                        </div>
                        <div className="row justify-content-space-evenly my-row2">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Parameter List</span>
                                </div>
                                <textarea className="form-control" aria-label="With textarea"></textarea>
                            </div>
                        </div>
                        <div className="row my-row1"></div>
                        <div className="row justify-content-space-evenly my-row">
                            <img src={multipleUserLogo} className="img-rounded" width="50" height="50" />
                        </div>
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
                        </div>
                        <div className="row justify-content-right my-row1">
                            <button type="button" className="btn btn-success">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        var s3 = new AWS.S3();
        s3.getObject({ Bucket: BUCKET_NAME, Key: this.props.match.params.templateKey }, (err, data) => {
            if (err) {
                console.log(err);
                throw err
            }
            mammoth.convertToHtml({ arrayBuffer: data.Body }).then((v, m) => {
                this.setState({ docHtml: v.value });
            });
        });
    }
}
export default CampaignPage;
