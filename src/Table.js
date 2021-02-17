import React from "react";

class Table extends React.Component {
    constructor(props) {
        super(props);
    } 

    render() {
        return (
            <table>
                <thead>
                    {this.renderTableHeader()}
                </thead>
                <tbody>
                    {this.props.data.map((_, i) => {return <tr key={i}>{this.renderRow(i)}</tr>})}
                </tbody>
            </table>
        );
    }


    renderTableHeader() {
        return (
            <tr>
                {this.props.data.map((column, i) => {return <th key={i}>{column.title}</th>})}
            </tr>
        )  
    }

    renderRow(i) {
        return (
                this.props.data.map((current, j) => {return <td key={j}> {current.content[i]} </td>})
        )
    }
}


export default Table;

