import React from "react";
import axios from 'axios';
import Table from "../components/Table";
import CampaignLogTable from "../components/CampaignLogTable";


// const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/email-logs"
let fakeData = {"Count":3,"Items":[{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"0"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"0"}},{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"1"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"0"}},{"EmailAddress":{"S":"teamMailItTest@gmail.com"},"OpenedStatus":{"S":"N/A"},"ClickedLinkStatus":{"S":"N/A"},"TemplateId":{"S":"0"},"MessageId":{"S":"2"},"SentDateTime":{"S":"04-01-2021"},"DeliveryStatus":{"S":"Delivered"},"DynamicValues":{"S":"{\"NAME\": \"Hugh\", \"AMOUNT\": \"$1,000,000\", \"PROMO_CODE\": \"www.google.com\"}"},"CampaignId":{"S":"1"}}],"ScannedCount":3}

class EmailLogTable extends React.Component {
    constructor(props) {
        super(props);
        // console.log("reached line 13 of EmailLogTable")
        // console.log("printing this.props:", this.props);
        // console.log("printing this.props.location:", this.props.location);
        // console.log("printing this.props.location.state:", props.location.state);
        // console.log("printing this.props.location.state.templateName:", props.location.state.templateName);
        this.state = {
            templateName: this.props.location.state.templateName,
            campaignId: this.props.location.state.campaignId
        }
    }

    getEmailTableData() {
        var apiString = "https://2rsf9haj99.execute-api.us-east-1.amazonaws.com/queryLogs/templateId/"
        let obj = `{tpId:${this.state.templateName},cpId:${this.state.campaignId}}`;
        var queryString =  apiString.concat(obj);
        var config = {
            method: 'get',
            url: queryString,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "S1VsUgcBCv14uSiR2yPPfaLlxGXv5FYdkdbOWUV6"
            }
        };

        axios(config)
            .then(response => {
                // console.log("response.data is;", response.data.Items)

                // let table = this.dataToTable(response.data.Items);
                let table = this.dataToTable(fakeData);
                this.setState({table: table})
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getEmailTableData()
    }
    // var header = { headers: {
    //      "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
    // }};
    // axios.get(DATA_LINK, header).then(response => {
    //     let table = this.dataToTable(response.data);
    //     console.log(table);
    //     this.setState({table: table})
    // });


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
        let templateKeyColumn = this.getColumnWithDisplayName("File Name", table);
        table.numRows = templateKeyColumn.content.length;
        return table;
    }

    getContent(columnTitle, data) {
        let content = [];
        for (let row of data.body) {
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
