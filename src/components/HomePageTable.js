import React from "react";
import axios from 'axios';

import Table from "./Table"


const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/logs"

let table = {
    numRows: 2, columns: [
        {
            title: "Template Key",
            content: ["3fda23114tdf5",
                "4s395ter203d4"]
        },
        {
            title: "Template Name",
            content: ["Offer Notice", "Change of Term"]
        },
        {
            title: "Upload Date",
            content: ["01/07/2019", "02/09/2017"]
        },
        {
            title: "Team",
            content: ["Marketing", "Investment"]
        },
        {
            title: "No. of Campaigns",
            content: ["3", "0"]
        },
        {
            title: "Status",
            content: [{button: {displayName: "Ready", link: "/campaignPage/3fda23114tdf5"}}, "Upload"]
        },
        {
            title: "Dynamic Values",
            content: ["NAME AMOUNT", "NAME"]
        },
        {
            title: "Details",
            content: [{button: {displayName: "View", link: "/HomePage"}}, {button: {displayName: "View", link: "/HomePage"}}]
        }
    ]
}

class HomePageTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {table: {}}
    }

    componentDidMount() {
        axios.get(DATA_LINK).then(response => {
            table = this.dataToTable(response.data);
            this.setState({table: table})
        });
    }

    render() {
        if (this.state.table) {
            return <Table data={table}/>;
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
        let table = {numRows: columnTitles.length, columns: []};
        if (data.statusCode === 200) {
            for (let i = 0; i < columnTitles.length; i++) {
                let columnTitle = columnTitles[i]
                table.columns.push({
                    title: columnTitle.displayName,
                    content: this.getContent(columnTitle, data)
                });
            }
        }
        this.addLinksToCampaignPage(table);
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Details": {
                    content.push({button: {displayName: "View", link: "/HomePage"}});
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