import React from "react";
import TemplateLogTable from "./TemplateLogTable";
import HomePageRight from "./HomePageRight";

class HomePage extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
        <div class="homepage">
            <TemplateLogTable/>
			<HomePageRight/>
        </div>
    );
	}
    
}

export default HomePage