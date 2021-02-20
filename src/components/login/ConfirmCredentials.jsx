import React, {useState} from 'react';
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
import 'crypto-js/lib-typedarrays';
import {Auth} from 'aws-amplify';

const initialFormState = {
    username: "", email: "", password: "", newPassword: "", authCode: "", formType: "ConfirmCredentials"
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://create.hsbc/content/dam/brandhub/homeassets/IceHex.jpg)',
        // backgroundRepeat: 'no-repeat',
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

export default function ConfirmCredentials() {
    const classes = useStyles();
    const [formState, updateFormState] = useState(initialFormState)

    function onChange(e) {
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]: e.target.value}))
        const {email, password, newPassword} = formState
    }

    const {formType} = formState

    async function confirmSignIn(e) {
        e.preventDefault()
        const {email, password, newPassword} = formState
        Auth.signIn(email, password)
            .then(user => {
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    // const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
                    Auth.completeNewPassword(
                        user,               // the Cognito User Object
                        newPassword,       // the new password
                        // OPTIONAL, the required attributes
                        // {
                        //     email: 'xxxx@example.com',
                        //     phone_number: '1234567890'
                        // }
                    ).then(user => {
                        updateFormState(() => ({...formState, formType: "signedIn"}))
                        // at this time the user is logged in if no MFA required
                    }).catch(e => {
                        console.log(e);
                    });
                } else {
                    // other situations
                }
            }).catch(e => {
            console.log(e);
        })
    }

    return (
        <div className="App"> {
            formType === "ConfirmCredentials" && (
                <Grid container component="main" className={classes.root}>
                    <CssBaseline/>
                    <Grid item xs={false} sm={4} md={7} className={classes.image}/>
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            {/*<Avatar className={classes.avatar}>*/}
                            {/*/!*    <LockOutlinedIcon />*!/*/}
                            {/*</Avatar>*/}
                            {/*<Typography component="h1" variant="h5">*/}
                            {/*    Confirm Account*/}
                            {/*</Typography>*/}
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
                                    id="password"
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
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={onChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="newPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={onChange}
                                />
                                {/*<FormControlLabel*/}
                                {/*    control={<Checkbox value="remember" color="primary" />}*/}
                                {/*    label="Remember me"*/}
                                {/*/>*/}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={confirmSignIn}
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
                                        <Link href="/" variant="body2">
                                            {"Already Confirmed? Sign In!"}
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
                    <h1> Connect home page component here! </h1>
                )
            }
        </div>
    )
}