import React from "react";
import { Link } from "react-router-dom";

/**  
 * 
 * @param {Array} data is in the form of
 * 
 * {numRows: <number>, columns: [
 *  <column> 
 *  (, <column>)*
 * ]}
 * <column> ::= {title: <string>, content:[list of <content>]}
 * <content> := <string> | <button>
 * <button> ::= {button: {displayName: <string>, link: <string>}}
 * 
 * - link should be string in the form of an HTML link e.g "/HomePage"
 * 
 * - button links to the route given by link
 * 
 * @param {Array} columns
 * 
 * Specifies which of the columns in the data should be shown in table
 * 
 * @param {boolean} loading 
 * 
 * If loading is true table shows a loading spinner and ignores the data prop
 * 
*/

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.loading) {
            return (
                <div className="vertical-horizontal-center">
                    <div className="spinner-border text-primary" style={{width: "6rem", height: "6rem"}}
                    role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        } else if (this.props.data) {
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
        } else {
            return (
                <div> Error: Loading not set to true and data not available </div>
            );
        }
    }


    renderTableHeader() {
        return (
            <tr>
                {this.props.data.columns.map((column, i) => { 
                    if (this.renderColumn(column.title)) {
                        return <th key={i}>{column.title}</th>;
                    }
                })}
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
                if (this.renderColumn(current.title)) {
                    return (
                        <td key={j}> 
                            {this.renderCell(current.content[i])}
                         </td>
                    )
                }
            })  
        )
    }

    renderCell(cell) {
        let type = typeof cell;
        if (type === "string") {
            return cell;
        } else if (type === "object") {
            if (Object.keys(cell)[0] === "button") {
                let data = cell.button.data ? cell.button.data : null;
                return (
                    <div className="d-flex justify-content-center">
                        <Link 
                            className="btn btn-primary"
                            role="button"
                            to={{pathname:cell.button.link, state: data}}>
                            {cell.button.displayName}
                        </Link>
                    </div>)
            }
        }
    }

    renderColumn(columnName) {
        let columnsToShow = this.props.columns;
        return !columnsToShow || columnsToShow.includes(columnName);
    }

}


export default Table;

