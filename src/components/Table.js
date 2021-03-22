import React from "react";
import { Link } from "react-router-dom";

/**  
 * Table is passed data 
 * data is in the form of
 * {numRows: <number>, columns: [
 *  <column> 
 *  (, <column>)*
 * ]}
 * <column> ::= {title: <string>, content:[<string>, <button>]} 
 * <button> ::= {button: {displayName: <string>, link: <string>}}
 * link should be string in the form of an HTML link e.g "/HomePage"
 * button links to the route given by link
*/

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
                        {this.renderCell(current.content[i], i)}
                     </td>
                )
            })  
        )
    }

    renderCell(cell, row) {
        let type = typeof cell;
        if (type === "string") {
            return cell;
        } else if (type === "object") {
            if (Object.keys(cell)[0] === "button") {
                return (
                    <div>
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

