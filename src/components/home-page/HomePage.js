import React, {useEffect, useState} from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"
import {Auth} from "aws-amplify";
import LoginPage from "../login/LoginPage";
import useCheckUser from "../login/useCheckUser";
import {Redirect} from "react-router";


class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
		this.state = {
			authenticated: useCheckUser.user,
		}
	}

	// async checkUser() {
	// 	try {
	// 		const user = await Auth.currentAuthenticatedUser();
	// 		if (user) {
	// 			this.state.authenticated = true
	// 		}
	// 	} catch (e) {
	// 		console.log(e)
	// 	}
	// }

	onUploadSuccess() {
		this.forceUpdate();
	}

	render() {
		console.log(this.state.authenticated)
		if (!this.state.authenticated) {
			// return <LoginPage/>
			return <Redirect to="/" />
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