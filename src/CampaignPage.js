import React from "react";
import "./App.css";
class CampaignPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div class="container-fluid my-container">
                <div class="row my-rows" style={{ textAlign: 'center' }}>
                    <div class="col-6 my-col">Preview Template</div>
                    <div class="col-6 my-col">Create Template</div>
                </div>
                <div class="row my-rows">
                    <div class="col-6 my-col">image</div>
                    <div class="col-6 my-col">Parameter List:
                <div class="row my-row1"></div>
                        <div class="row justify-content-space-evenly my-row">
                            <img src="userLogo.png" class="img-rounded" width="30" height="30" />
                        </div>
                        <div class="row justify-content-space-evenly my-row2">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Single Email Address</span>
                                </div>
                                <input type="text" class="form-control" aria-label="EmailAddress"></input>
                            </div>
                        </div>
                        <div class="row justify-content-space-evenly my-row2">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Parameter List</span>
                                </div>
                                <textarea class="form-control" aria-label="With textarea"></textarea>
                            </div>
                        </div>
                        <div class="row my-row1"></div>
                        <div class="row justify-content-space-evenly my-row">
                            <img src="multipleUserLogo.png" class="img-rounded" width="50" height="50" />
                        </div>
                        <div class="row justify-content-space-evenly my-row2">
                            <div class="input-group mb-3">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="inputGroupFile02" />
                                    <label class="custom-file-label" for="inputGroupFile02">CSV File Upload</label>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-space-evenly my-row2">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="inputGroup-sizing-default">Subject Line</span>
                                </div>
                                <input type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                            </div>
                        </div>
                        <div class="row justify-content-left my-row1">
                            <img src="scrap.png" class="img-rounded" width="50" height="50" />
                            <button type="button" class="btn btn-danger">Remove Template</button>
                        </div>
                        <div class="row justify-content-right my-row1">
                        <button type="button" class="btn btn-success">Submit</button>
                    	</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CampaignPage;
