import React from "react";
import axios from 'axios';
import Table from "../components/Table";


// const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/campaign-logs"


class CampaignLogTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        // this.state = {
        //     templateName:props.location.state.templateName
        // }
    }

    // var header = { headers: {
    //      "x-api-key": process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
    // }};
    // axios.get(DATA_LINK, header).then(response => {
    //     let table = this.dataToTable(response.data);
    //     console.log(table);
    //     this.setState({table: table})
    // });

    // var data = JSON.stringify({
    //     "min": 0,
    //     "max": 5
    // });




    // TODO
    // 1) obtain data from LogDataset, using logData POST API and getcampaignlogdata lambda
    // 2) populate the front end table
    // alternalte approach with api logData and lambda getcampaignLogData: 'https://ue4fr66yvj.execute-api.us-east-1.amazonaws.com/logStage',
    getLogTableData() {
        // console.log("getLogTableData is running")
        var apiString = "https://2rsf9haj99.execute-api.us-east-1.amazonaws.com/queryLogs/templateId/"
        var templateId = this.state.templateName;
        var queryString =  apiString.concat(templateId);
        var config = {
            method: 'get',
            url: queryString,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': "S1VsUgcBCv14uSiR2yPPfaLlxGXv5FYdkdbOWUV6"
            }
        };
        // process.env.REACT_APP_AWS_TEMPLATE_LOG_API_KEY
        // I created the following key, but how do I use it: S1VsUgcBCv14uSiR2yPPfaLlxGXv5FYdkdbOWUV6

        axios(config)
            .then(response => {
                // console.log("response.data is;", response.data)
                let separatedCampaigns = this.separateCampaigns(response.data.Items);
                // console.log("separatedCampaigns is :", separatedCampaigns)
                let rowInformation = this.makeRowInformation(separatedCampaigns);
                // console.log("rowInformation is: ", rowInformation)
                let table = this.dataToTable(rowInformation);
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
        console.log(this.state.table)
        return ( 
            <div className="col-lg-9 pl-0 pr-1">
                <Table data={this.state.table}/>
            </div>        
        );
    }

    separateCampaigns(data) {
        let campaignMap = new Map();
        var i;
        for (i = 0; i < data.length; i++) {
            // The C might not be capitalised, as seen in lambda
            if (campaignMap.has(data[i].CampaignId.S)) {
                campaignMap.get(data[i].CampaignId.S).push(data[i])
            } else {
                let campaignArray = []
                campaignArray.push(data[i])
                campaignMap.set(data[i].CampaignId.S, campaignArray)
            }
        }
            return campaignMap
    }


    makeRowInformation(separatedCampaigns) {
        var i;
        let tableForm = [];
        for (let [key, value] of separatedCampaigns) {
            let campaignId = key;
            let sentDateTime = value[0].SentDateTime.S;
            let numEmailed = 0;
            let numSuccessfullyDelivered = 0;
            let numOpened = 0;
            let numLinks = 0;
            console.log(value.length)
            for (i = 0; i < value.length; i++) {

                numEmailed ++;
                if (value[i].DeliveryStatus.S === "Delivered") {
                    numSuccessfullyDelivered ++;
                }
                if (value[i].OpenedStatus.S === "Opened") {
                    numOpened ++;
                }
                if (!(value[i].ClickedLinkStatus.S === "Clicked")) {
                    numLinks ++;
                }
            }

            let row = {
                CampaignId: campaignId,
                SentDateTime: sentDateTime,
                NumEmailed: numEmailed,
                NumSuccessfullyDelivered: numSuccessfullyDelivered,
                NumOpened: numOpened,
                NumLinks: numLinks
            }
            tableForm.push(row)
        }
        return tableForm;
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
        // let items = data.items

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
                    console.log("this.state.templateName is:", this.state.templateName)
                    console.log("row['CampaignId'] is:", row['CampaignId'])
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
