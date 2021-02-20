// import logo from './logo.svg';
import '../../App.css';
// import login from "./components/login/login";
// Added by Franco Feb 16 -  next 3 lines
// import Amplify, { Auth } from 'aws-amplify';
import {Auth, Hub } from 'aws-amplify';
import awsconfig from '../../aws-exports';
// import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import React, {useState, useEffect} from "react";
// Amplify.configure(awsconfig);
// import loginImage from "./images/hsbcLoginSummerWinter.jpg";


// material-ui
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const initialFormState = {
    username: "", email: "", password: "", newPassword: "", authCode: "", formType: "signIn"
}

// from https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js#sign-out


// function Copyright() {
//     return (
//         <Typography variant="body2" color="textSecondary" align="center">
//             {'Copyright © '}
//             <Link color="inherit" href="https://material-ui.com/">
//                 Your Website
//             </Link>{' '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://create.hsbc/content/dam/brandhub/homeassets/IceHex.jpg)',
        // 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function LoginPage() {
    const classes = useStyles();
    const [formState, updateFormState] = useState(initialFormState)
    function onChange(e){
        e.persist()
        updateFormState(() =>({...formState, [e.target.name]: e.target.value}))
    }
    const {formType} = formState
    async function signIn(e) {
        e.preventDefault()
        const {email, password} = formState
        try {
            // const username = this.signupForm.get('email').value.toLowerCase( ),
            //     password: this.signupForm.get('password').value,
            await Auth.signIn(email, password);
            updateFormState(() =>({...formState, formType: "signedIn"}))
            // whatNext()
        } catch (error) {
            console.log('error signing in', error);
        }
    }
    // function whatNext(){
    //     const {formType} = formState
    //     if (formType === "signedIn" ){
    //         window.location.replace('/Home');
    //     }
        // else{
        //     window.location.replace('/ConfirmSignUp');
        // }
    // }

    return (
        <div className="App"> {
            formType === "signIn" &&  (
                <div>
                    <Grid container component="main" className={classes.root}>
                        <CssBaseline />
                        <Grid item xs={false} sm={4} md={7} className={classes.image} />
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Sign in
                                </Typography>
                                <form className={classes.form} noValidate>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        placeholder="email"
                                        onChange= {onChange}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        placeholder="password"
                                        onChange= {onChange}
                                    />
                                    <FormControlLabel
                                        control={<Checkbox value="remember" color="primary" />}
                                        label="Remember me"
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={signIn}
                                    >
                                        Sign In
                                    </Button>
                                    <Grid container>
                                        {/*<Grid item xs>*/}
                                        {/*    <Link href="#" variant="body2">*/}
                                        {/*        Forgot password?*/}
                                        {/*    </Link>*/}
                                        {/*</Grid>*/}
                                        <Grid item>
                                            <Link href="/ConfirmCredentials" variant="body2">
                                                {"Update Temporary Password Here!"}
                                            </Link>
                                        </Grid>
                                    </Grid>
                                    {/*<Box mt={5}>*/}
                                    {/*    <Copyright />*/}
                                    {/*</Box>*/}
                                </form>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )
        }
            {
                formType === "signedIn" && (
                    <h1> Connect home page component here! </h1>
                )
            }
        </div>
    );
}

export default LoginPage
// export default withAuthenticator(App);
// =============================
// 6chl57dkfs39u98dg140fpo931
// =============================

// async function signOut() {
//     try {
//         await Auth.signOut();
//     } catch (error) {
//         console.log('error signing out: ', error);
//     }
// }
//
// function App() {
//     const [formState, updateFormState] = useState(initialFormState)
//     function onChange(e){
//         e.persist()
//         updateFormState(() =>({...formState, [e.target.name]: e.target.value}))
//     }
//     const {formType} = formState
//   return (
//     <div className="App">
//       <header className="App-header">
//           {/*<Authenticator hideDefault={true}>*/}
//           <h2>This AWS sucks</h2>
//           {/*    <login/>*/}
//           {/*</Authenticator>*/}
//       </header>
//     </div>
//   );
// }

// const App = () => (
//     <div>
//       <login/>
//     </div>
// );







// from https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js#sign-out
// async function resendConfirmationCode() {
//     try {
//         await Auth.resendSignUp(username);
//         console.log('code resent successfully');
//     } catch (err) {
//         console.log('error resending code: ', err);
//     }
// }

// Password recovery implementation was not implemented as this is a MVP project, otherwise view:
// https://docs.amplify.aws/lib/auth/manageusers/q/platform/js#retrieve-current-authenticated-user