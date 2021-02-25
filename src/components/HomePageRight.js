import React from "react";
import FileUpload from "./FileUpload";
import {Link} from "react-router-dom";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="right-component">
                 <Link
                     className="btn btn-light mt-5 ml-5 mr-5 mb-5 float-right"
                     role="button"
                     to={"/"}>LogOut
                 </Link>
                <button className="btn btn-light btn-block mt-5"> View Job Logs </button>
                <FileUpload />
            </div> 
        )
    }
}

export default HomePageRight;