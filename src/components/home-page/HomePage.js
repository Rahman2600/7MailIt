import React from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.key = 0;
	}
	render() {
		this.key += 1;
		return (
			<div className="scroll container-fluid">
				<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
				<TemplateLogTable key={this.key}/>
			</div>
    	);
	}

	onUploadSuccess() {
		this.forceUpdate();
	}
    
}

export default HomePage