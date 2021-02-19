import React from "react";
import "./App.css";
import { useParams } from "react-router-dom";
class CampaignPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {templateKey: ''}
    }
    render() {
        return (
            <div className="container-fluid my-container">
                <div className="row my-rows" style={{ textAlign: 'center' }}>
                    <div className="col-6 my-col">Preview Template</div>
                    <div className="col-6 my-col">Create Template</div>
                </div>
                <div className="row my-rows">
                    <div className="col-4 my-col">image</div>
                    <div className="col-4 my-col"> {this.state.templateKey} </div>
                    <div className="col-4 my-col">Parameter List:
                <div className="row my-row1"></div>
                        <div className="row justify-content-space-evenly my-row">
                            <img src="userLogo.png" className="img-rounded" width="30" height="30" />
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
                            <img src="multipleUserLogo.png" className="img-rounded" width="50" height="50" />
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
                            <img src="scrap.png" className="img-rounded" width="50" height="50" />
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
        this.setState({templateKey: this.props.match.params.templateKey})
    }
}
export default CampaignPage;
