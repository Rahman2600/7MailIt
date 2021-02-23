import './App.css';
import React from "react";
import LoginPage from "./components/login/LoginPage"
// import Home from "./components/home/Home
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Table from './components/Table.js';
import HomePageRight from "./components/HomePageRight";
import CampaignPage from "./components/CampaignPage";


function App() {
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
                content: [{button: "Ready"}, "Upload"]
            },
            {
                title: "Dynamic Values",
                content: ["NAME AMOUNT", "NAME"]
            },
            {
                title: "Details",
                content: [{button: "View"}, {button: "View"}]
            }
        ]
    }

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    <Route exact path="/HomePage"><Table data={table}/><HomePageRight/></Route>
                    <Route path="/campaignPage/:templateKey" component={CampaignPage}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App

