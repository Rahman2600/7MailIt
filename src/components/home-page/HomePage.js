import React from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"

class HomePage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="scroll container-fluid">
				<TemplateLogTable key={this.key}/>
				<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
			</div>
    	);
	}

	onUploadSuccess() {
		this.forceUpdate();
	}
    
}

export default HomePage