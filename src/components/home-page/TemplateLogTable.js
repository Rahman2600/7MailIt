import React from "react";
import axios from 'axios';

import Table from "../Table";
import Pagination from "../Pagination";
import PageDataStore from "../../model/PageDataStore";
import CheckList from "../CheckList"


const NUM_TEMPLATES_ON_PAGE = 17; //dynamically set based on screen size?

class TemplateLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {page: 1, table: null, editingColumns: false, columns: []}
        this.pageDataStore = new PageDataStore();
        this.onChangePage = this.onChangePage.bind(this);
        this.getNumPages = this.getNumPages.bind(this);
        this.defaultColumns = ["File Name", "Template Name", "Upload Date", "Create Email Campaign", "Campaign Logs"];
        this.sortableColumns = ["File Name",  "Template Name", "Upload Date", "Team"];
        this.onEditColumns = this.onEditColumns.bind(this);
        this.onSelectedColumnsChange = this.onSelectedColumnsChange.bind(this);
    }

    componentDidMount() {
        this.getNumTemplates();
        this.loadPage(this.state.page);
    }

    componentDidUpdate(prevProps) {
        if (this.props.id != prevProps.id) {
            this.loadPage(this.state.page);
        }
    }

    loadPage(i) {
        this.setState({loading: true});
        let min = NUM_TEMPLATES_ON_PAGE * (i - 1) + 1;
        let max = min + NUM_TEMPLATES_ON_PAGE - 1;
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
            console.log("done");
            // console.log(JSON.stringify(response));
            let table = this.dataToTable(response);
            this.pageDataStore.addPage(i, table);
            // console.log(table);
            this.setState({table: table, page: i, loading: false})
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    getNumTemplates () {
        console.log("starting");
        var params = {
            min: 0,
            max: 0
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
            this.setState({numTemplates: response.data[0].tID});
            console.log(this.state.numTemplates);
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
                {table && this.state.numTemplates?
                <div>
                    <Pagination current={this.state.page} max={this.getNumPages()} onChangePage={this.onChangePage}/>
                    <Table data={table} 
                    columns={this.state.columns.map((column) => {
                        return {title: column, sort: this.sortableColumns.includes(column)}
                    })}/> 
                </div>: 
                <Table loading={true}/>}
            </div>        
        );
    }

    getNumPages() {
        let numPages = Math.round(this.state.numTemplates/NUM_TEMPLATES_ON_PAGE);
        console.log(numPages);
        return numPages;
    }

    onChangePage(i) {
        if (this.state.page !== i) {
            if (this.pageDataStore.hasPage(i)) {
                console.log("hasPage");
                this.setState({table: this.pageDataStore.getPage(i), page: i});
                
            } else {
                this.loadPage(i);
            }
            
        }
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
                    content.push({button: {displayName: "View", link: "/EmailLogTable"}});
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
