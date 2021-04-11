import React from "react";
import axios from 'axios';
import Table from "../components/Table";
import { Link } from "react-router-dom";
import {Redirect} from "react-router";


const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/campaign-logs"


class CampaignLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.defaultColumns = ["CampaignId", 
                               "Date of Campaign Launch", 
                               "No. of People Emailed", 
                               "No. of Emails Successfully Delivered", 
                               "No. of Opened Emails",
                               "No. of Links Opened",
                               "Email Log"];
        this.sortableColumns = ["CampaignId",  "Date of Campaign Launch"];
        this.state = {
            templateName: this.props.location.state.templateName,
            table: null,
            columns: [],
            authenticated: this.props.user
        }
        console.log(this.state);
    }

    getLogTableData() {
        var apiString = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/campaign-logs?templateId="
        var templateId = this.state.templateName;
        console.log(templateId);
        var queryString =  apiString.concat(templateId);
        var config = {
            method: 'get',
            url: queryString,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_AWS_CAMPAIGN_LOG_API_KEY
            }
        };

        axios(config)
            .then(response => {
                let table = this.dataToTable(response.data.body);
                console.log(table);
                this.setState({table: table})
                console.log(this.state);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getLogTableData()
    }

    render() {
        let table = this.state.table;
        if (table) {
            this.state.columns = table.columns.map(({title}) => title);
        }
        if (this.state.authenticated !== true) {
            return <Redirect to="/" />
        } else {
            return (
                <div className="scroll container-fluid" style={{"max-width": "100%"}}>
                    <div className="float-left col-lg-3 ">
                        <Link
                            className="btn btn-primary mt-5 ml-5 mr-5 mb-5 "
                            role="button"
                            id="logOutButton"
                            to={"/"}>Log Out
                        </Link>
                        <Link 
                            className="btn btn-primary d-block mt-5 ml-5 mr-5 mb-5"
                            role="button"
                            to={"/HomePage"}>
                            {"Return to Home Page"}
                        </Link>
                    </div> 
                    <div className="float-right col-lg-9 pl-0 pr-1">
                        <h1 className="mt-2">{`Campaign logs: ${this.state.templateName}`}</h1>
                        {table? <Table data={table} 
                        columns={this.state.columns.map((column) => {
                            return {title: column, sort: this.sortableColumns.includes(column)}
                        })}/> : 
                        <Table loading={true}/>}
                    </div>
                </div>        
            );
        }
        
            
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"CampaignId", apiName: "CampaignId"},
            {displayName:"Date of Campaign Launch", apiName: "SentDateTime"}, 
            {displayName:"No. of People Emailed", apiName: "NumEmailed"}, 
            {displayName:"No. of Emails Successfully Delivered", apiName: "NumSuccessfullyDelivered"},
            {displayName:"No. of Opened Emails", apiName: "NumOpened"},
            {displayName:"No. of Links Opened", apiName: "NumLinks"},
            {displayName:"Email Log", apiName: ""}
        ];

        let table = {columns: []};
        for (let i = 0; i < columnTitles.length; i++) {
            console.log(columnTitles.length);
            let columnTitle = columnTitles[i];
            table.columns.push({
                title: columnTitle.displayName,
                content: this.getContent(columnTitle, data)
            });
        }
        let templateKeyColumn = this.getColumnWithDisplayName("CampaignId", table);
        table.numRows = templateKeyColumn.content.length;
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Date of Campaign Launch": {
                        content.push(row["SentDateTime"]);
                    break;
                }
                case "No. of People Emailed": {
                    content.push(row['NumEmailed'].toString());
                    break;
                }
                case "No. of Emails Successfully Delivered": {
                    content.push(row['NumSuccessfullyDelivered'].toString());
                    break;
                }
                case "No. of Opened Emails": {
                    content.push(row['NumOpened'].toString());
                    break;
                }
                case "No. of Links Opened": {
                    content.push(row['NumLinks'].toString());
                    break;
                }
                case "Email Log": {
                    // console.log("this.state.templateName is:", this.state.templateName)
                    // console.log("row['CampaignId'] is:", row['CampaignId'])
                    console.log(this.state.templateName);
                    content.push({
                        button: {
                            displayName: "View",
                            link: `/EmailLogTable/`,
                            data: {templateName: this.state.templateName, campaignId: row['CampaignId']},
                            }});
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

    getColumnWithDisplayName(displayName, table) {
        for (let column of table.columns) {
            if (column.title === displayName) {
                return column;
            }
        }
    }
}

export default CampaignLogTable;
