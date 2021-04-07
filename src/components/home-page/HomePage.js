import React, {useEffect, useState} from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"
import {Redirect} from "react-router";


class HomePage extends React.Component {
	 constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
		this.state = {
			authenticated: this.props.user,
		}
	}

	onUploadSuccess() {
		this.forceUpdate();
	}

	render() {
		if (this.state.authenticated !== true) {
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