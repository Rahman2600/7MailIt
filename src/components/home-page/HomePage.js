import React from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";
import "../../styles/HomePage.css"

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.onUploadSuccess = this.onUploadSuccess.bind(this);
		this.id = 0;
	}
	render() {
		this.id += 1;
		return (
			<div className="scroll container-fluid" style={{"max-width": "100%"}}>
				<TemplateLogTable id={this.id}/>
				<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
			</div>
    	);
	}

	onUploadSuccess() {
		this.forceUpdate();
	}
    
}

export default HomePage