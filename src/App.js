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
                        <Route exact path="/HomePage"><HomePage user={user}/></Route>
                        <Route path="/campaignPage/:templateKey" 
                               render={(props) => (
                                 <CampaignPage {...props} user={user}/>)
                               }>
                        </Route> 
                        <Route path="/CampaignLogTable" render={(props) => (
                                 <CampaignLogTable {...props} user={user}/>)
                               }>
                        </Route>
                        <Route path="/EmailLogTable" render={(props) => (
                                 <EmailLogTable {...props} user={user}/>)
                               }>
                        </Route>
                        <Route path="/UnderConstructionPage" render={(props) => (
                                 <UnderConstructionPage {...props} user={user}/>)
                               }>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
}

export default App;


