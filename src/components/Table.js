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
 * link should be string in the form of an HTML link e.g "/HomePage"
 * button links to the route given by link
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
        this.state = {
            data: this.props.data,
            columnsAscending: [true,true,true,true]
        }
        console.log(this.state);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            this.setState(nextProps);
            console.log("nextProps",this.state.data);
        }
    }
    handleSorting = (column) => {
        console.log("initial state",this.state.data)
        let dataCopy = JSON.parse(JSON.stringify(this.state.data))        //array1.forEach(this.props.data => console.log(element))
        let arr = dataCopy.columns
        //console.log('state before sorted:', this.state.data.columns[column].content);
        //console.log('dataCopy before sorted', dataCopy.columns[column].content)

        //bubble sort with the weird object 2d array 
        let n = arr[column].content.length;
        for (let i = 0; i < n-1; i++)
            for (let j = 0; j < n-i-1; j++)
                if(this.state.columnsAscending[column] == true) {
                    if (arr[column].content[j] > arr[column].content[j+1]) {
                        // swap arr[j+1] and arr[j]
                    for(let k = 0; k < arr.length;k++) {
                        let temp = arr[k].content[j];
                        arr[k].content[j] = arr[k].content[j+1];
                        arr[k].content[j+1] = temp;
                    }
                    }
            } else {
                if (arr[column].content[j] < arr[column].content[j+1]) {
                    // swap arr[j+1] and arr[j]
                for(let k = 0; k < arr.length;k++) {
                    let temp = arr[k].content[j];
                    arr[k].content[j] = arr[k].content[j+1];
                    arr[k].content[j+1] = temp;
                }
                }
            }
        let columnsAscendingCopy = [...this.state.columnsAscending];
        columnsAscendingCopy[column] = !columnsAscendingCopy[column]
        this.setState({data:dataCopy,columnsAscending:columnsAscendingCopy})
                //this.setState(this.props.data.columns[i].content); 
        //console.log('state after sorted:', this.state.data.columns[column].content);
        //console.log('dataCopy after sorted', dataCopy.columns[column].content)
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
                {this.state.data.columns.map((column, i) => { 
                    if (this.renderColumn(column.title)) {
                        return ( 
                            <th key={i}>
                                {column.title}
                                {this.addSortButtonToColumn(column.title)? 
                                <button className="btn-group-vertical float-right" onClick={() => this.handleSorting(i)}>
                                    <span>&#9650;</span> 
                                </button> :
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
            [...Array(this.state.data.numRows).keys()].map((i) => {
                return <tr key={i} >{this.renderRow(i)}</tr>;               
            })
        )
    }

    renderRow(i) {
        return (
            this.state.data.columns.map((current, j) => { 
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

    renderCell(cell, row) {
        let type = typeof cell;
        if(cell == null) {
            return "null";
        }
        if (type === "string") {
            return cell;
        } else if (type === "object") {
            if (Object.keys(cell)[0] === "button") {
                let data = cell.button.data ? cell.button.data : null;
                return (
                    <div>
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

