import React from "react";
import axios from 'axios';
import Table from "../components/Table";


// const DATA_LINK = "https://cif088g5cd.execute-api.us-east-1.amazonaws.com/v1/campaign-logs"


class CampaignLogTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: "1"
            // this.props.location.state.templateName
        }
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
        console.log("getLogTableData is running")
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
                console.log(response.data)
                //TODO make new functiont to parse the return values into proper format
                let table = this.dataToTable(response.data.items);
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
        console.log("render is running")
        console.log(this.state.table)
        return ( 
            <div className="col-lg-9 pl-0 pr-1">
                <Table data={this.state.table}/>
            </div>        
        );
    }

    dataToTable(data) {
        let columnTitles = [
            {displayName:"File Name", apiName: "TemplateName"},
            {displayName:"Date of Campaign Launch", apiName: "SentDateTime"}, 
            {displayName:"No. of People Emailed", apiName: "NumEmailed"}, 
            {displayName:"No. of Emails Successfully Delivered", apiName: "NumSuccessfullyDelivered"},
            {displayName:"No. of Opened Emails", apiName: "NumOpened"},
            {displayName:"No. of Links Opened", apiName: "NumLinks"},
            {displayName:"Email Log", apiName: ""}
        ];

        let table = {columns: []};
        // let items = data.items

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
                case "Date of Campaign Launch": {
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
                case "No. of People Emailed": {
                    content.push(row['NumEmailed'].toString());
                    break;
                }
                case "No. of Emails Successfully Delivered": {
                    let value = row['NumSuccessfullyDelivered'].toString();
                    content.push(value);
                    break;
                }
                case "No. of Opened Emails": {
                    let value = row['NumOpened'].toString();
                    content.push(value);
                    break;
                }
                case "No. of Links Opened": {
                    let value = row['NumLinks'].toString();
                    content.push(value);
                    break;
                }
                default:
                    if (apiName) {;
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
