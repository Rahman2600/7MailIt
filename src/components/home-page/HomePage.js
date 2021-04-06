import React, {useEffect, useState} from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"
import {Auth} from "aws-amplify";
import LoginPage from "../login/LoginPage";

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
	}
	const [user, updateUser] = useState(null);

	async function checkUser() {
		try {
			const user = await Auth.currentAuthenticatedUser();
		} catch (e) {
			console.log(e)
		}
	}

	useEffect(() => {
	checkUser().then(user => updateUser(user))
	console.log("user at checkUser is :", user);
}, []
)

if (!user) {
	return <LoginPage updateUser={updateUser}/>
} else {
	render() {
		this.id += 1;
		return (
			<div className="scroll container-fluid" style={{"max-width": "100%"}}>
				<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
				<TemplateLogTable id={this.id}/>
			</div>
    	);
	}

	onUploadSuccess() {
		this.forceUpdate();
	}
    
}

export default HomePage