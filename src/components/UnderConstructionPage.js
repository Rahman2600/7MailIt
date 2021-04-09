import React from "react"
import {Redirect} from "react-router";

class UnderConstructionPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authenticated: this.props.user,
		}
	}
	render() {
		if (this.state.authenticated !== true) {
			return <Redirect to="/"/>
		} else {
			return (
				<div>Page Under Construction: Please return to the home page by pressing the back button.</div>
			);
		}
	}
}

export default UnderConstructionPage