import React from "react";
import FileUpload from "./FileUpload";
import {Link} from "react-router-dom";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="col-lg-3">
                 <Link
                     className="btn btn-primary mt-5 ml-5 mr-5 mb-5 float-right"
                     role="button"
                     id="logOutButton"
                     to={"/"}>Log Out
                 </Link>
                <Link to="/UnderConstructionPage">
                    <button  
                        id="viewLogButton" 
                        className="btn btn-primary btn-block mt-5"> 
                        View All Campaign Logs 
                    </button>
                </Link>
                <FileUpload />
            </div> 
        )
    }
}

export default HomePageRight;