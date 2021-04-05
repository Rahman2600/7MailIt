import React from "react";
import axios from 'axios';

import Table from "../Table";
import Pagination from "../Pagination";

const PAGE_SIZE = 16; //to be dynamically set based on screen size in the future

class TemplateLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 0}
        this.onChangePage = this.onChangePage.bind(this);
    }

    componentDidMount() {
        this.loadPage(0);
    }

    loadPage(i) {
        let min = PAGE_SIZE * i + 1;
        let max = min + PAGE_SIZE - 1;
        var params = {
            min: min,
            max: max
         };
        var config = {
            method: 'get',
            url: 'https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/template-logs-with-range',
            headers: { 
              'Content-Type': 'application/json'
            },
            params : params
        };

        axios(config)
          .then(response => {
            console.log(JSON.stringify(response));
            let table = this.dataToTable(response);
            console.log(table);
            this.setState({table: table, page: i})
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return ( 
            <div className="col-lg-9 pl-0 pr-1">
                <Pagination current={0} max={6} onChangePage={this.onChangePage}/> 
                <Table data={this.state.table}/>
            </div>        
        );
    }

    onChangePage(i) {
        if (this.state.page !== i) {
            this.loadPage(i);
        }   
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"File Name", apiName: "S3Key"}, 
            {displayName:"Template Name", apiName: "TemplateName"}, 
            {displayName:"Upload Date", apiName: "DocUploadDateTime"},
            {displayName:"Team", apiName: "Team"},
            {displayName:"No. of Campaigns", apiName: ""},
            {displayName:"Create Email Campaign", apiName: "UploadStatus"},
            {displayName:"Campaign Logs", apiName: ""}
        ];
        let table = {columns: []};
        if (data.statusCode === 200 || data.status === 200) {
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
        this.addLinksToCampaignPage(table);
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.data) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Campaign Logs": {
                    content.push({button: {displayName: "View", link: "/UnderConstructionPage"}});
                    break;
                }
                case "No. of Campaigns": {
                    content.push("TODO");
                    break;
                }
                case "Create Email Campaign": {
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
        let templateKeyColumn = this.getColumnWithDisplayName("File Name", table);
        let statusColumn = this.getColumnWithDisplayName("Create Email Campaign", table);
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

export default TemplateLogTable;
