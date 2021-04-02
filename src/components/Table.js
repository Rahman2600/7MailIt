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
 * - specifies which columns should be shown in table if columns is not specified all columns are shown
 * 
 * - columns is an array of {title: <string> ,sort: <boolean> }
 * 
 * - title is the title of a column we want included in the table
 * - sort is an optional field that indicates whether we should be able to sort column, columns with sort
 * set to true have a sorting button beside them in table.
 * 
 * - Default sorting order is alphabetical order of strings
 * 
 * 
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
                        return ( 
                            <th key={i}>
                                {column.title}
                                {this.addSortButtonToColumn(column.title)? 
                                <span className="float-right sort">&#9660;</span> :
                                                            <span></span>}
                            </th>
                        );
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
        return !columnsToShow || columnsToShow.map(({title}) => title).includes(columnName);
    }

    addSortButtonToColumn(columnName) {
        let columnsToShow = this.props.columns;
        for(let {title, sort} of columnsToShow) {
            if (columnName == title && sort) {
                return true;
            }
        } 
        return false;
    }

}


export default Table;

