import React from "react";
import FileUpload from "./FileUpload";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
    }

    render() {
        return (
                <div className="col-lg-3">
                    <FileUpload onUploadSuccess={this.onUploadSuccess}/>
                </div> 
        )
    }

    onUploadSuccess() {
        this.props.onUploadSuccess();
    }
}

export default HomePageRight;