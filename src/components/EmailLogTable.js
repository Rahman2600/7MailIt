import React from "react";
import axios from 'axios';
import Table from "../components/Table";
import CampaignLogTable from "../components/CampaignLogTable";


// const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/email-logs"
let fakeData = {"Count":3,"Items":[{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"0"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"0"}},{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"1"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"0"}},{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"2"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"1"}}],"ScannedCount":3}

class EmailLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: this.props.location.state.templateName,
            campaignId: this.props.location.state.campaignId
        }
    }

    getEmailTableData() {
        var apiString = `https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/email-logs?templateId=${this.state.templateName}&campaignId=${this.state.campaignId}`
        console.log(apiString);
        var config = {
            method: 'get',
            url: apiString,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "TKrgRRW19c5YY4DREgvfd3nqD0lZh4RP12KvwQBC"
            }
        };

        axios(config)
            .then(response => {
                console.log(response);
                let table = this.dataToTable(response.data);
                this.setState({table: table})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getEmailTableData()
    }


    render() {
        let table = this.state.table;
        return ( 
            <div style={{"max-width": "100%"}}>
                {table? <Table data={table} columns={this.state.columns}/> : <Table loading={true}/>}
            </div>        
        );
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"Message Id", apiName: "MessageId"},
            {displayName:"Sent Date", apiName: "SentDateTime"}, 
            {displayName:"Email Address", apiName: "EmailAddress"}, 
            {displayName:"Delivery Status", apiName: "DeliveryStatus"}, 
            {displayName:"Open Status", apiName: "OpenedStatus"}, 
            {displayName:"Clicked Link Status", apiName: "ClickedLinkStatus"},
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
        let messageIdColumn = this.getColumnWithDisplayName("Message Id", table);
        console.log(messageIdColumn);
        table.numRows = messageIdColumn.content.length;
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body.Items) {
           let apiName = columnTitle.apiName;
            switch (columnTitle.displayName) {
                case "Message Id": {
                    content.push(row['MessageId']);
                    break;
                }
                case "Sent Date": {
                    let value = row['SentDateTime'];
                    content.push(value);
                    break;
                }
                case "Email Address": {
                    let value = row['EmailAddress'];
                    content.push(value);
                    break;
                }
                case "Delivery Status": {
                    let value = row['DeliveryStatus'].toString();
                    content.push(value);
                    break;
                }
                case "Open Status": {
                    let value = row['OpenedStatus'].toString();
                    content.push(value);
                    break;
                }
                case "Clicked Link Status": {
                    let value = row['ClickedLinkStatus'].toString();
                    content.push(value);
                    break;
                }
                // default:
                //     if (apiName) {
                //         content.push(row[columnTitle.apiName]);
                //     }
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
