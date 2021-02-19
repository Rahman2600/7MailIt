import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import CampaignPage from "./CampaignPage";

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table table-striped left-component" >
                <thead>
                    {this.renderTableHeader()}
                </thead>
                <tbody>
                    {this.renderTableBody()}
                </tbody>
            </table>
        );
    }


    renderTableHeader() {
        return (
            <tr>
                {this.props.data.columns.map((column, i) => { return <th key={i}>{column.title}</th> })}
            </tr>
        )
    }

    renderTableBody() {
        return (
            [...Array(this.props.data.numRows).keys()].map((i) => {
                return <tr key={i}>{this.renderRow(i)}</tr>;               
            })
        )
    }

    renderRow(i) {
        return (
            this.props.data.columns.map((current, j) => { 
                return (
                    <td key={j}> 
                        {this.renderContent(current.content[i])}
                     </td>
                )
            })  
        )
    }

    renderContent(content) {
        let type = typeof content;
        if (type === "string") {
            return content;
        } else if (type === "object") {
            if (Object.keys(content)[0] === "button") {
                return (
                    <Link 
                    className="btn btn-light"
                    role="button"
                    to="/campaignPage"> 
                    {content.button}
                    </Link>)
            }
        }
    }
}


export default Table;

