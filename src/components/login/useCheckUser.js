import { useState } from 'react';
import {Auth} from "aws-amplify";
// import LoginPage from "./LoginPage";

export default function useCheckUser() {

    // let user = false
    const [user, setUser] = useState(false);

    async function checkUser() {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser().then((token) => {
                if (token) {
                    setUser(true)
                    console.log("reached line 15 of useCheckUser")
                    resolve()
                } else {
                    reject("User authentification failed")
                }
            }).catch((e) => {
                reject(e)
            });
        })
    }




        //         }))
        //         // const token = await Auth.currentAuthenticatedUser();
        //         // console.log(token)
        //         if (token){
        //             user = true;
        //             console.log("what")
        //             // setUser(true)
        //         }
        //
        //
        //         console.log("user at useCheckUser is:", user);
        //     } catch (e) {
        //         console.log(e)
        //     }
        // }
    return {
        checkUser: checkUser,
        user
    }
}
// //
//
//
//
//
//
// // const getToken = () => {
// //     const tokenString = sessionStorage.getItem('token');
// //     const userToken = JSON.parse(tokenString);
// //     if (userToken) {
// //         return userToken.token
// //     }
// // };
// // const [user, updateUser] = useState(null);
// //
// // async function checkUser() {
// //     try {
// //         const user = await Auth.currentAuthenticatedUser();
// //     } catch (e) {
// //         console.log(e)
// //     }
// // }
// //
// // useEffect(() => {
// //         checkUser().then(user => updateUser(user))
// //         console.log("user at checkUser is :", user);
// //     }, []
// // )
// //
// // if (!user) {
// //     return <LoginPage updateUser={updateUser}/>
// // } else {
//
// //     const tokenString = sessionStorage.getItem('token');
// //     const userToken = JSON.parse(tokenString);
// //     if (userToken) {
// //         return userToken.token
// //     }
// // };
//
// // // const [token, setToken] = useState(getToken());
// // const authenticate = user => {
// //     sessionStorage.setItem('token', JSON.stringify(userToken));
// //     setToken(userToken.token);
// // };