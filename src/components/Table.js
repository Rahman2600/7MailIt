import React from "react";
import { Link } from "react-router-dom";

/**  
 * - Table is passed data as a prop 
 * 
 * - data is in the form of
 * {numRows: <number>, columns: [
 *  <column> 
 *  (, <column>)*
 * ]}
 * <column> ::= {title: <string>, content:[<string>, <button>]} 
 * <button> ::= {button: {displayName: <string>, link: <string>}}
 * 
 * - link should be string in the form of an HTML link e.g "/HomePage"
 * 
 * - button links to the route given by link
 * 
 * - Table can handle data loading, if data is null loading spinner is displayed on the page and 
 * table is displayed as soon as data is available
*/

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.data) {
            return (
                <div>
                    <table className="table table-striped" >
                        <thead>
                            {this.renderTableHeader()}
                        </thead>
                        <tbody>
                            {this.renderTableBody()}
                        </tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <div className="center">
                    <div className="spinner-border text-primary" style={{width: "6rem", height: "6rem"}}
                    role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
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
                    return <tr key={i} >{this.renderRow(i)}</tr>;  
            })              
        )
    }

    renderRow(i) {
        return (
            this.props.data.columns.map((current, j) => { 
                return (
                    <td key={j}> 
                        {this.renderCell(current.content[i])}
                     </td>
                )
            })  
        )
    }

    renderCell(cell) {
        let type = typeof cell;
        if (type === "string") {
            return cell;
        } else if (type === "object") {
            if (Object.keys(cell)[0] === "button") {
                return (
                    <div className="d-flex justify-content-center">
                        <Link 
                            className="btn btn-primary"
                            role="button"
                            to={cell.button.link}> 
                            {cell.button.displayName}
                        </Link>
                    </div>)
            }
        }
    }

}


export default Table;

