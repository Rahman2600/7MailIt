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
			<div className="container-fluid">
				<TemplateLogTable />
				<HomePageRight/>
			</div>
    	);
	}
    
}

export default HomePage