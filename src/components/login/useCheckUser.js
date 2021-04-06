import { useState } from 'react';
import {Auth} from "aws-amplify";

export default function useCheckUser() {

    async function checkUser() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                if (user){
                    updateUser(true)
                }
            } catch (e) {
                console.log(e)
            }
        }

    const [user, updateUser] = useState(false);

    return {
        checkUser: checkUser,
        user
    }
}





// const getToken = () => {
//     const tokenString = sessionStorage.getItem('token');
//     const userToken = JSON.parse(tokenString);
//     if (userToken) {
//         return userToken.token
//     }
// };
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

//     const tokenString = sessionStorage.getItem('token');
//     const userToken = JSON.parse(tokenString);
//     if (userToken) {
//         return userToken.token
//     }
// };

// // const [token, setToken] = useState(getToken());
// const authenticate = user => {
//     sessionStorage.setItem('token', JSON.stringify(userToken));
//     setToken(userToken.token);
// };