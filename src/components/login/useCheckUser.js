import {useState} from 'react';
import {Auth} from "aws-amplify";

export default function useCheckUser() {


    const [user, setUser] = useState(false);

    async function checkUser() {
        return new Promise((resolve, reject) => {
            Auth.currentAuthenticatedUser().then((token) => {
                if (token) {
                    setUser(true)
                    resolve()
                } else {
                    reject("User authentification failed")
                }
            }).catch((e) => {
                reject(e)
            });
        })
    }

    return {
        checkUser: checkUser,
        user:user
    }
}

// code without new promise//
// try {
// 		const token = await Auth.currentAuthenticatedUser();
// 		if (token){
// 			return true;
// 		}
// 	} catch (e) {
// 		console.log(e)
// 	}
// }