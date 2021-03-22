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
		<div className="container-fluid">
			<div className="row">
				<TemplateLogTable key={this.key}/>
				<HomePageRight onUploadSuccess={this.onUploadSuccess}/>
			</div>
		</div>
		);
	}

	onUploadSuccess() {
		this.forceUpdate();
	}
    
}

export default HomePage