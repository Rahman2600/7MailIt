import './App.css';
import React from "react";
import LoginPage from "./components/login/LoginPage"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePageTable from './components/HomePageTable.js';
import HomePageRight from "./components/HomePageRight";
import CampaignPage from "./components/CampaignPage";
import CampaignLogTable from "./components/CampaignLogTable";


function App() {

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    <Route exact path="/HomePage"><HomePageTable/><HomePageRight/></Route>
                    <Route path="/campaignPage/:templateKey" component={CampaignPage}/>
                    <Route path="/CampaignLogTable" component={CampaignLogTable}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App

