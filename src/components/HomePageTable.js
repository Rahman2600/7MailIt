import React from "react";
import axios from 'axios';

import Table from "./Table"


const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/logs"

class HomePageTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        var header = { headers: {
            "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
       }};
        axios.get(DATA_LINK, header).then(response => {
            console.log(response.data);
            let table = this.dataToTable(response.data);
            console.log(table);
            this.setState({table: table})
        });
    }

    render() {
        if (this.state.table) {
            return <Table data={this.state.table}/>;
        } else {
            return <div></div>
        }
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"Template Key", apiName: "S3Key"}, 
            {displayName:"Template Name", apiName: "TemplateName"}, 
            {displayName:"Upload Date", apiName: "DocUploadDateTime"},
            {displayName:"Team", apiName: "Team"},
            {displayName:"No. of Campaigns", apiName: ""},
            {displayName:"Status", apiName: "UploadStatus"},
            {displayName:"Details", apiName: ""}
        ];
        let table = {columns: []};
        if (data.statusCode === 200) {
            for (let i = 0; i < columnTitles.length; i++) {
                let columnTitle = columnTitles[i]
                table.columns.push({
                    title: columnTitle.displayName,
                    content: this.getContent(columnTitle, data)
                });
            }
        } else {
            console.log("Request failed with " + data.statusCode)
        }
        let templateKeyColumn = this.getColumnWithDisplayName("Template Key", table);
        table.numRows = templateKeyColumn.content.length;
        this.addLinksToCampaignPage(table);
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Details": {
                    content.push({button: {displayName: "View", link: "/CampaignLogTable"}});
                    break;
                }
                case "No. of Campaigns": {
                    content.push("TODO");
                    break;
                }
                case "Status": {
                    let value = row[columnTitle.apiName];
                    if (value == "Ready") {
                        content.push({button: {displayName:"Ready", link:""}});
                    } else {
                        content.push(value);
                    }
                    break;
                }
                case "Upload Date": {
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
                default:
                    if (apiName) {
                        content.push(row[columnTitle.apiName]);
                    }
                }
        }
        return content;
    }

    addLinksToCampaignPage(table) {
        let templateKeyColumn = this.getColumnWithDisplayName("Template Key", table);
        let statusColumn = this.getColumnWithDisplayName("Status", table);
        let content = statusColumn.content;
        for(let i = 0; i < content.length; i++) {
            let current = content[i];
            if (typeof current === "object") {
                current.button.link = `campaignPage/${templateKeyColumn.content[i]}`;
            }
        }
    }

    getColumnWithDisplayName(displayName, table) {
        for (let column of table.columns) {
            if (column.title === displayName) {
                return column;
            }
        }
    }


}

export default HomePageTable;