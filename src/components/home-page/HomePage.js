import React, {useEffect, useState} from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"
import {Redirect} from "react-router";
import useCheckUser from "../login/useCheckUser";


class HomePage extends React.Component {
	
	 
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
		console.log(this.props.user)
		this.state = {
			authenticated: this.props.user,
		}
		console.log(this.state);
	}
    

	onUploadSuccess() {
		console.log("success");
		this.forceUpdate();
	}

	render() {
		if (this.state.authenticated !== true) {
			console.log("are we here?");
			return <Redirect to="/" />
		} else {
			console.log("please");
			this.id += 1;
			return (
				<div className="scroll container-fluid" style={{"max-width": "100%"}}>
					<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
					<TemplateLogTable id={this.id}/>
				</div>
			);
		}


	}
}

export default HomePage