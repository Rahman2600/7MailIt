import './App.css';
import {useEffect, useState} from "react";
import LoginPage from "./components/login/LoginPage"
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import HomePage from "./components/home-page/HomePage";
import CampaignPage from "./components/CampaignPage";
import CampaignLogTable from "./components/CampaignLogTable";
import EmailLogTable from "./components/EmailLogTable";
import UnderConstructionPage from './components/UnderConstructionPage';
import {Auth} from "aws-amplify";
import useCheckUser from "./components/login/useCheckUser";

function App() {


    const { user, checkUser } = useCheckUser();

    useEffect(() => {
        checkUser()
        console.log("useEffect user value is", user)
        }
        , [user]
    )

    // const [user, updateUser] = useState(null);
    //
    // async function checkUser() {
    //     try {
    //         const user = await Auth.currentAuthenticatedUser();
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    //
    // useEffect(() => {
    //         checkUser().then(user => updateUser(user))
    //         console.log("user at checkUser is :", user);
    //     }, []
    // )
    //
    // if (!user) {
    //     return <LoginPage updateUser={updateUser}/>
    // } else {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        {/*<Route exact path="/" render={(props) => <LoginPage updateUser={(user) => updateUser(user)} {...props} />} />*/}
                        {/*<Route exact path="/" <LoginPage /> />*/}
                        <Route path="/" component={LoginPage} exact/>
                        <Route exact path="/HomePage"><HomePage user={user}/></Route>
                        <Route path="/campaignPage/:templateKey" component={CampaignPage}/>
                        <Route path="/CampaignLogTable"><CampaignLogTable/></Route>
                        <Route path="/EmailLogTable"><EmailLogTable/></Route>
                        <Route path="/UnderConstructionPage"><UnderConstructionPage/></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
}

export default App;


