import './App.css';
import {useEffect} from "react";
import LoginPage from "./components/login/LoginPage"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePage from "./components/home-page/HomePage";
import CampaignPage from "./components/CampaignPage";
import CampaignLogTable from "./components/CampaignLogTable";
import EmailLogTable from "./components/EmailLogTable";
import UnderConstructionPage from './components/UnderConstructionPage';
import useCheckUser from "./components/login/useCheckUser";

function App() {

    let { user, checkUser } = useCheckUser();

    useEffect(() => {
        checkUser()
        }
    )

        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={LoginPage} exact/>
                        <Route exact path="/HomePage" component={HomePage} user={user}></Route>
                        <Route path="/campaignPage/:templateKey" component={CampaignPage} user={user}/>
                        <Route path="/CampaignLogTable" component={CampaignLogTable} user={user}/>
                        <Route path="/EmailLogTable" component={EmailLogTable} user={user}/>
                        <Route path="/UnderConstructionPage" component={UnderConstructionPage}user={user}></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
}

export default App;


