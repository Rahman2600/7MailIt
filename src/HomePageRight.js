import React from "react";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="right-component">
                <button className="btn btn-light mt-5 ml-5 mr-5 mb-5 float-right"> Log out </button>
                <button className="btn btn-light btn-block mt-5"> View Job Logs </button>
                <button className="btn btn-light btn-block mt-5"> Upload New Template </button>
            </div> 
        )
    }
}

export default HomePageRight;