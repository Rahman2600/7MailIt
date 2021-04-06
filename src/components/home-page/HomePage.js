import React, {useEffect, useState} from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"
import {Auth} from "aws-amplify";
import LoginPage from "../login/LoginPage";
import {checkUser, user} from "../login/useCheckUser";


class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
	}

// 	useEffect(() => {
// 	checkUser;
// }, []
// )

	onUploadSuccess() {
		this.forceUpdate();
	}

	render() {
		checkUser
		if (!user) {
			return <LoginPage/>
		} else {
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