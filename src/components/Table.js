import React from "react";
import { Link } from "react-router-dom";

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
                        {this.renderContent(current.content[i], i)}
                     </td>
                )
            })  
        )
    }

    renderContent(content, row) {
        let type = typeof content;
        if (type === "string") {
            return content;
        } else if (type === "object") {
            if (Object.keys(content)[0] === "button") {
                return (
                    <div>
                        <Link 
                            className="btn btn-light"
                            role="button"
                            to={`/campaignPage/${this.getTemplateKey(row)}`}> 
                            {content.button}
                        </Link>
                    </div>)
            }
        }
    }

    getTemplateKey(row) {
        let keys = this.props.data.columns[0].content;
        return keys[row];
    }
}


export default Table;

