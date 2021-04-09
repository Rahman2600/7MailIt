import './App.css';
import React from "react";
import LoginPage from "./components/login/LoginPage"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePage from "./components/home-page/HomePage";
import CampaignPage from "./components/CampaignPage";
import CampaignLogTable from "./components/CampaignLogTable";
import EmailLogTable from "./components/EmailLogTable";
import UnderConstructionPage from './components/UnderConstructionPage';


function App() {

    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    <Route exact path="/HomePage"><HomePage/></Route>
                    <Route path="/campaignPage/:templateKey" component={CampaignPage}/>
                    <Route path="/CampaignLogTable" component={CampaignLogTable}/>
                    <Route path="/EmailLogTable" component={EmailLogTable}/>
                    <Route path="/UnderConstructionPage"><UnderConstructionPage/></Route>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App

