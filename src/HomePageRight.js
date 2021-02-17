import React from "react";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="right-component">
                <button className="btn btn-primary"> Log out </button>
                <button className="btn btn-primary"> Upload New Template </button>
            </div> 
        )
    }
}

export default HomePageRight;