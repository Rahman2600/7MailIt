
import './App.css';
import React, {useState, useEffect} from "react";
import LoginPage from "./components/login/LoginPage"
import Home from "./components/home/Home"
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from 'aws-amplify';

const initialFormState = {
    username: "", email: "", password: "", newPassword: "", authCode: "", formType: "signIn"
}

function App() {
    const [formState, updateFormState] = useState(initialFormState)
    const [user, updateUser] = useState(null)

    useEffect(() => {
        checkUser()
    },
        [])

    async function checkUser() {
        try {
            const user = await Auth.currentAuthenticatedUser()
            updateUser(user)
            updateFormState(() =>({...formState, formType: "signedIn"}))
        }
        catch (err){
            updateUser(null)
        }
    }
    return (
        <BrowserRouter>
                <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    {/*<Route path="/Home" component={Home}/>*/}
                </Switch>
        </BrowserRouter>
    );
}

export default App
