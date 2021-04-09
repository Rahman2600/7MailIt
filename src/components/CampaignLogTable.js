import React from "react";
import axios from 'axios';
import Table from "../components/Table";
import { ContactlessOutlined } from "@material-ui/icons";

class CampaignLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: this.props.location.state.templateName
        }
    }

    getLogTableData() {
        var apiString = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/campaign-logs?templateId="
        var templateId = this.state.templateName;
        var queryString =  apiString.concat(templateId);
        var config = {
            method: 'get',
            url: queryString,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "8nobK0hMri7W16vHzMj0S1SfOC5m7sPU4zxNBFX8"
            }
        };

        axios(config)
            .then(response => {
                let table = this.dataToTable(response.data.body);
                this.setState({table: table})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getLogTableData()
    }

    render() {
        return ( 
            <div className="col-lg-9 pl-0 pr-1">
                <Table data={this.state.table}/>
            </div>        
        );
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
                    content.push({
                        button: {
                            displayName: "View",
                            link: `EmailLogTable/`,
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
