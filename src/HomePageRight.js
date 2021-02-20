import React from "react";
import FileUpload from "./FileUpload";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="right-component">
                <button className="btn btn-light mt-5 ml-5 mr-5 mb-5 float-right"> Log out </button>
                <button className="btn btn-light btn-block mt-5"> View Job Logs </button>
                <FileUpload />
            </div> 
        )
    }
}

export default HomePageRight;