import React from "react";
import FileUpload from "./FileUpload";
import {Link} from "react-router-dom";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
    }

    render() {
        return (
             <div className="float-left col-lg-3 ">
                 <Link
                     className="btn btn-primary mt-5 ml-5 mr-5 mb-5 float-left"
                     role="button"
                     id="logOutButton"
                     to={"/"}>Log Out
                 </Link>
                <Link to="/CampaignLogTable">
                    <button  
                        id="viewLogButton" 
                        className="btn btn-primary btn-block mt-5"> 
                        View All Campaign Logs 
                    </button>
                </Link>
                <FileUpload onUploadSuccess={this.onUploadSuccess}/>
            </div> 
        )
    }

    onUploadSuccess() {
        console.log("Success");
        this.props.onUploadSuccess();
    }
}

export default HomePageRight;