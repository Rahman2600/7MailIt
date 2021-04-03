import React from "react";
import axios from 'axios';

import Table from "../Table"
import CheckList from "../CheckList"
import { checkServerIdentity } from "tls";


const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/logs"

class TemplateLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.defaultColumns = ["File Name", "Template Name", "Upload Date", "Create Email Campaign", "Campaign Logs"];
        this.state = {table: null, editingColumns: false, columns: []};
        this.getTableData = this.getTableData.bind(this);
        this.onEditColumns = this.onEditColumns.bind(this);
        this.onSelectedColumnsChange = this.onSelectedColumnsChange.bind(this);
    }

    componentDidMount() {
        this.getTableData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.id != prevProps.id) {
            this.getTableData()
        }
    }

    getTableData() {
        // var data = JSON.stringify({
        //     "min": 0,
        //     "max": 5
        // });
          
       var config = {
            method: 'get',
            url: 'https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/logs',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
            }
          };
          
          axios(config)
          .then(response => {
            this.sortTemplateLogs(response.data);
            let table = this.dataToTable(response.data);
            this.setState({table: table, columns: table.columns.map(({title}) => title)})
          })
          .catch(function (error) {
            console.log(error);
        });   
    }

    render() {
        let table = this.state.table;
        if (table) {
            let columns = table.columns.map(({title}) => title);
           //console.log(columns);
        }
        return ( 
            <div className="float-left col-lg-9 pl-0 pr-1">
                <h1 className="mt-2">Template logs</h1>
                <button className="btn btn-primary mb-2" onClick={this.onEditColumns}> Edit columns </button>
                {this.state.editingColumns && table ? 
                <div className="mb-2">
                    <CheckList list={table.columns.map(({title}) => {
                        if (!this.defaultColumns.includes(title)) {
                            return {value: title, checked: true}
                        }
                    }).filter((element) => element != null)} onChange={this.onSelectedColumnsChange}/>
                </div>
                : <div></div>}
                {table? <Table data={table} columns={this.state.columns}/> : <Table loading={true}/>}
            </div>        
        );
    }

    onSelectedColumnsChange(checkedStates) {
        let additionalColumns = [];
        for (let {value, checked} of checkedStates) {
            if (checked) {
                additionalColumns.push(value);
            }
        }
        this.setState({columns: this.defaultColumns.concat(additionalColumns)})
    }

    onEditColumns() {
        if (this.state.table != null) {
            this.setState({editingColumns: !this.state.editingColumns});
        }
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"File Name", apiName: "S3Key"}, 
            {displayName:"Template Name", apiName: "TemplateName"}, 
            {displayName:"Upload Date", apiName: "DocUploadDateTime"},
            {displayName:"Team", apiName: "Team"},
            {displayName:"Dynamic Values", apiName: "DynamicValues"},
            {displayName:"Create Email Campaign", apiName: "UploadStatus"},
            {displayName:"Campaign Logs", apiName: ""}
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
        this.addLinksToCampaignPage(table);
        this.addLinksToCampaignLogTable(table)
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Campaign Logs": {
                    content.push({button: {displayName: "View", link: "", data: ""}});
                    break;
                }
                case "Dynamic Values": {
                    let value = row[columnTitle.apiName];

                    let commaList = this.arrayToCommaSeperatedString(value);
                    //Need to remove this once dynamic value parsing is complete
                    content.push(commaList);
                    break;
                }
                case "Create Email Campaign": {
                    let value = row[columnTitle.apiName];
                    if (value == "Ready") {
                        content.push({button: {displayName:"Ready", link:"", data: ""}});
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
        let fileNameColumn = this.getColumnWithDisplayName("File Name", table);
        let templateNameCoumn = this.getColumnWithDisplayName("Template Name", table);
        let dynamicValuesColumn = this.getColumnWithDisplayName("Dynamic Values", table);
        let statusColumn = this.getColumnWithDisplayName("Create Email Campaign", table);
        let content = statusColumn.content;
        for(let i = 0; i < content.length; i++) {
            let current = content[i];
            if (typeof current === "object") {
                current.button.link = `campaignPage/${fileNameColumn.content[i]}`;
                current.button.data = {dynamicValues: JSON.parse(this.commaSeperatedStringToArray(dynamicValuesColumn.content[i])), 
                                       templateName: templateNameCoumn.content[i]};
            }
        }
    }

    addLinksToCampaignLogTable(table) {
        let templateNameColumn = this.getColumnWithDisplayName("Template Name", table);
        let CampaignLogsColumn = this.getColumnWithDisplayName("Campaign Logs", table);
        let content = CampaignLogsColumn.content;

        for(let i = 0; i < content.length; i++) {
            let current = content[i];
            if (typeof current === "object") {
                current.button.link = `CampaignLogTable/`;
                current.button.data = {
                    templateName: templateNameColumn.content[i]};
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

    sortTemplateLogs(templateLogs) {
        templateLogs.body.sort((a, b) => {
            let dateA = new Date(a.DocUploadDateTime);
            let dateB = new Date(b.DocUploadDateTime)
            return dateB - dateA;
        });
    }

    arrayToCommaSeperatedString(dynamicValueString) {
        let newString = dynamicValueString
                            .replace("]", "");
        newString = newString.replace("[", "");
        return newString;
    }

    commaSeperatedStringToArray(dynamicValueString) {
        return "[" + dynamicValueString + "]";
    }

}

export default TemplateLogTable;
