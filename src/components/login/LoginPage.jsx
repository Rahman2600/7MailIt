// Authentification
import '../../App.css';
import {Auth, Hub} from 'aws-amplify';
import React, {useState, useEffect} from "react";

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
import {makeStyles} from '@material-ui/core/styles';
import {Redirect} from "react-router";

const initialFormState = {
    username: "", email: "", password: "", confirmPassword: "", newPassword: "", authCode: "", formType: "signIn"
}

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
    const [showErrorMsg,setShowErrorMsg] = useState(false); 
    const [errorMsg,setErrorMsg] = useState(""); 

    function onChange(e) {
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]: e.target.value}))
    }

    const {formType} = formState

    async function signIn(e) {
        e.preventDefault()
        setShowErrorMsg(false);
        setErrorMsg("");
        const {email, password} = formState
        if(email.includes(" ")) {
            setShowErrorMsg(true);
            setErrorMsg("The email address cannot contain any white space.");
        } else if(email === "" || password === "") {
            setShowErrorMsg(true);
            setErrorMsg("The email address or password cannot be empty.");
        } else {
            try {
                await Auth.signIn(email, password);
                updateFormState(() => ({...formState, formType: "signedIn"}))
            } catch (error) {
                signInErrorMessageProcessing(error);
            }
        }
    }

    function confirmCredentials(e) {
        e.preventDefault()
        updateFormState(() => ({...formState, formType: "confirmCredentials"}))
    }

    const signInErrorMessageProcessing = (error) => {
            setShowErrorMsg(true);
            switch(error.message) {
                case "Password attempts exceeded.":
                    setErrorMsg("Password attempts exceeded. Please wait 5 minutes before logging back in again.");
                    break;
                case "Username cannot be empty.":
                case "Incorrect username or password.":
                case "User does not exist.":
                    setErrorMsg(error.message);
                    break;
                default:
                    setErrorMsg("An error has occured. More details contained in the console.");
                    break;
            }
            console.log('Authentication error:', error);
    }

    async function confirmAndSignIn(e) {
        e.preventDefault();
        setShowErrorMsg(false);
        setErrorMsg("");
        const {email, password, newPassword, confirmPassword} = formState
        if(confirmPassword !== newPassword) {
            setShowErrorMsg(true);
            setErrorMsg("New and confirmed password do not match.")
        } else {
            setShowErrorMsg(false);
            Auth.signIn(email, password)
            .then(user => {
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    Auth.completeNewPassword(
                        user,               // the Cognito User Object
                        newPassword,       // the new password
                    ).then(user => {
                        console.log("made it");
                        updateFormState(() => ({...formState, formType: "signedIn"}))
                        // at this time the user is logged in if no MFA required
                    }).catch(error => {
                        console.log("made it here");
                        setShowErrorMsg(true);
                        setErrorMsg("An error has occured: " + error.message);
                    });
                } else {
                    setShowErrorMsg(true);
                    setErrorMsg("Cannot update a permanent password. Please login using the main authentication page. ");
                }
            }).catch(error => {
                signInErrorMessageProcessing(error);
            })
        }
        
    }

    return (
        <div className="App"> {
            formType === "signIn" && (
                <div>
                    <Grid container component="main" className={classes.root}>
                        <CssBaseline/>
                        <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon/>
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
                                        onChange={onChange}
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
                                        onChange={onChange}
                                    />
                                    
                                    {showErrorMsg?<h6 style={{color: 'red'}}>{errorMsg}</h6>:null}
                                    <Button
                                        data-testid="loginpagetypography"
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
                                            <a
                                                // href="/ConfirmCredentials" variant="body2"
                                                href="#"
                                                onClick={confirmCredentials}
                                            >
                                                {"Update Temporary Password Here!"}
                                            </a>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )
        }
            {
                formType === "confirmCredentials" && (
                    <Grid container component="main" className={classes.root}>
                        <CssBaseline/>
                        <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                            <div className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    Update Temporary Credentials
                                </Typography>
                                <Typography component="h9" variant="h8">
                                    This page is only intended to update temporary credentials. 
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
                                        onChange={onChange}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Temporary Password"
                                        type="password"
                                        id="temp-password"
                                        // autoComplete="current-password"
                                        onChange={onChange}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="newPassword"
                                        label="New Password"
                                        type="password"
                                        id="new-password"
                                        autoComplete="current-password"
                                        onChange={onChange}
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Confirm New Password"
                                        type="password"
                                        id="confirm-password"
                                        autoComplete="current-password"
                                        onChange={onChange}
                                    />
                                    {/*<FormControlLabel*/}
                                    {/*    control={<Checkbox value="remember" color="primary" />}*/}
                                    {/*    label="Remember me"*/}
                                    {/*/>*/}
                                    {showErrorMsg?<h6 style={{color: 'red'}}>{errorMsg}</h6>:null}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={confirmAndSignIn}
                                    >
                                        Update Password and Sign In
                                    </Button>
                                    <Grid container>
                                        {/*<Grid item xs>*/}
                                        {/*    <Link href="#" variant="body2">*/}
                                        {/*        Forgot password?*/}
                                        {/*    </Link>*/}
                                        {/*</Grid>*/}
                                        <Grid item>
                                            <Link
                                                href="/" variant="body2">
                                                {"Temporary Password Already Changed? Click Here!"}
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
                )
            }
            {
                formType === "signedIn" && (
                    <Redirect to="/HomePage" />
                )
            }
        </div>
    );
}

export default LoginPage


// =====================================================
// code inspired from
// https://www.youtube.com/watch?v=JaVu-sS3ixg&t=953s

// Password recovery implementation was not implemented as this is a MVP project, otherwise view:
// https://docs.amplify.aws/lib/auth/manageusers/q/platform/js#retrieve-current-authenticated-user