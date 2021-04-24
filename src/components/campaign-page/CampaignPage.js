import React from "react";
import "../../App.css";

import SingleEmailCampaignCreation from "./SingleEmailCampaignCreation";
import BatchEmailCampaignCreation from "./BatchEmailCampaignCreation";
import { Link } from "react-router-dom";
import {Redirect} from "react-router";
var AWS = require('aws-sdk');
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
        super(props); 
        this.state = {
            authenticated: this.props.user,
            templateKey: this.props.location.state.templateKey,
            dynamicValues: this.props.location.state.dynamicValues,
            templateName: this.props.match.params.templateName,
            setVisible: true 
        }
    }

    render() {
        if (this.state.authenticated !== true) {
            return <Redirect to="/" />
        } else {
            return (
                <div className="container-fluid my-container">
                    <div className="row my-rows" style={{ textAlign: 'center' }}>
                        <div className="col-6 my-col">{`Preview Template: ${this.state.templateName}`}</div>
                        <div className="col-6 my-col">Create Email Campaign</div>
                    </div>
                    <div className="row my-rows">
                        {this.state.docHtml?
                            <div className="col-6 my-col img-responsive overflow-auto" style={{wordWrap: 'break-word'}}  dangerouslySetInnerHTML={{ __html: this.state.docHtml }} /> :
                            <div className="col-6 my-col">
                                <div className="vertical-horizontal-center">
                                    <div className="spinner-border text-primary" style={{width: "6rem", height: "6rem"}} role="status"></div>
                                </div>
                            </div>}

                        <div className="col-6 my-col">
                            <div className="d-flex justify-content-end">
                                <Link
                                    className="btn btn-primary mt-2"
                                    role="button"
                                    id="homepagebutton"
                                    to={"/HomePage"}>
                                    {"Return to Home Page"}
                                </Link>
                            </div>
                            <div className="row my-row1"></div>
                            <div>
                                <div class="dropdown text-center">
                                    <button class="btn btn-primary dropdown-toggle mt-2" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Single/Batch Email Campaign
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" onClick={() => this.setState({ setVisible: true })}>Single Email Campaign</a>
                                        <a class="dropdown-item" id="RemoveTemplateDropDown" onClick={() => this.setState({ setVisible: false })}>Batch Email Campaign</a>
                                    </div>
                            </div>
                                {this.state.setVisible? <SingleEmailCampaignCreation dynamicValues={this.state.dynamicValues} templateName={this.state.templateName}/> :
                                <BatchEmailCampaignCreation dynamicValues={this.state.dynamicValues} templateName={this.state.templateName} />}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    async componentDidMount() {
        var s3 = new AWS.S3();
        s3.getObject({ Bucket: BUCKET_NAME, Key: this.state.templateKey }, (err, data) => {
            if (err) {
                console.log("Could not get Object from S3 Bucket Error",err);
                throw err
            }
            mammoth.convertToHtml({ arrayBuffer: data.Body }).then((v, m) => {
                this.setState({ docHtml: v.value });
            });
        });
    }
}
export default CampaignPage;
