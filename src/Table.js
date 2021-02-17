import React from "react";
import { objectExpression } from "@babel/types";

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <table className="table table-striped" >
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
                        {this.renderContent(current.content[i], i)}
                     </td>
                )
                // } else if (current.button) {
                //     return <td key={j}><button> {current.button} </button></td>;
                // } else {
                //     return <td key={j}> error </td>;
                // }
            })  
        )
    }

    renderContent(content, i) {
        let type = typeof content;
        if (type === "string") {
            return content;
        } else if (type === "object") {
            if (Object.keys(content)[0] === "button") {
                return <td key={i}><button> {content.button} </button></td>; 
            }
        }
    }
}


export default Table;

