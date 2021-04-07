import React from "react";
import FileUpload from "./FileUpload";
import {Link} from "react-router-dom";
import {Auth} from "aws-amplify";

class HomePageRight extends React.Component {
    constructor(props) {
        super(props);
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
    }

    async signOut(e) {
        try {
            await Auth.signOut();
            console.log("signed Out!")
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    render() {
        return (
             <div className="float-left col-lg-3 ">
                 {/*<Link*/}
                 {/*    className="btn btn-primary mt-5 ml-5 mr-5 mb-5 float-left"*/}
                 {/*    role="button"*/}
                 {/*    id="logOutButton"*/}
                 {/*    to={"/"}>Log Out*/}
                 {/*</Link>*/}
                 <a
                     className="btn btn-primary mt-5 ml-5 mr-5 mb-5 float-right"
                     role="button"
                     id="logOutButton"
                     href={"/"}
                     onClick={()=> {this.signOut().then(r => console.log("successfully signed out"))}}
                     // to={"/"}>
                 >Log Out
                 </a>
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
        this.props.onUploadSuccess();
    }
}

export default HomePageRight;