import React from "react";
import axios from 'axios';
import Table from "../components/Table";


const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/email-logs"


class EmailLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    componentDidMount() {
        var header = { headers: {
             "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
        }};
        axios.get(DATA_LINK, header).then(response => {
            let table = this.dataToTable(response.data);
            console.log(table);
            this.setState({table: table})
        });
    }

    render() {
        console.log(this.state.table)
        return ( 
            <div style={{"max-width": "100%"}}>
                <Table data={this.state.table}/>
            </div>        
        );
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"File Name", apiName: "TemplateName"}, 
            {displayName:"Sent Date", apiName: "SentDateTime"}, 
            {displayName:"Email Address", apiName: "EmailAddress"}, 
            {displayName:"Delivery Status", apiName: "DeliveryStatus"}, 
            {displayName:"Open Status", apiName: "OpenedStatus"}, 
            {displayName:"Clicked Link Status", apiName: "ClickedLinkStatus"},
            {displayName:"Dynamic Values", apiName: "DynamicValues"},  
            {displayName:"Job Log ID", apiName: "JobLogId"}, 
            {displayName:"Message ID", apiName: "MessageId"}, 
        ];
        let table = {columns: []};
        if (data.statusCode === 200) {
            for (let i = 0; i < columnTitles.length; i++) {
                let columnTitle = columnTitles[i];
                table.columns.push({
                    title: columnTitle.displayName,
                    content: this.getContent(columnTitle, data)
                });
            }
        } else {
            console.log("Request failed with " + data.statusCode)
        }
        let templateKeyColumn = this.getColumnWithDisplayName("File Name", table);
        table.numRows = templateKeyColumn.content.length;
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Sent Date": {
                    let value = row[columnTitle.apiName];
                    if (value) {
                        let dateObj = new Date(value);
                        var date = dateObj.getDate();
                        var month = dateObj.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                        var year = dateObj.getFullYear();
                            
                        var dateString = date + "/" + month + "/" + year;
                        content.push(dateString);
                    } else {
                        content.push(" ");
                    }
                    break;
                }

                // case "File Name": {
                //     let value = row['TemplateName'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Sent Date": {
                //     let value = row['SentDateTime'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Email Address": {
                //     let value = row['EmailAddress'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Delivery Status": {
                //     let value = row['DeliveryStatus'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Open Status": {
                //     let value = row['OpenedStatus'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Clicked Link Status": {
                //     let value = row['ClickedLinkStatus'].toString();
                //     content.push(value);
                //     break;
                // }
                // case "Dynamic Values": {
                //     let value = row['DynamicValues'].toString();
                //     content.push(value);
                //     break;
                // }
                default:
                    if (apiName) {;
                        content.push(row[columnTitle.apiName]);
                    }
                }
        }
        return content;
    }


    getColumnWithDisplayName(displayName, table) {
        for (let column of table.columns) {
            if (column.title === displayName) {
                return column;
            }
        }
    }


}

export default EmailLogTable;
