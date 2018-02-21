import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';
import './Login.css';

import forestFooter from './../img/forestFooter.jpg';
import logo from './../img/egmlogo.svg';

// MUI
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors
import blue from 'material-ui/colors/blue';
import blueGrey from 'material-ui/colors/blueGrey';

// MUI Components
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
// import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';

// MUI icons


// Firebase References
import firebase from './../firebase';
// const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();

// Colors
// const primary = blue;
// const secondary = blueGrey;

// const primaryColor = '#01579B';
// const secondaryColor = '#C62828';




class PasswordReset extends Component {

    constructor(props) {

        super(props);
        this.state = {
            pageTitle: "EGM App: Passwort Reset",
            userResetEmail: '',
            errorMessage: '',
            errorEmail: false
        };

    }



    handlePasswordReset() {

        let resetEmail = this.state.userResetEmail;

        if (resetEmail === '') {

            return alert('Du hast keine Email angegeben!');

        }

        auth.sendPasswordResetEmail(resetEmail).catch(error => {

            switch (error.code) {

                case 'auth/invalid-email':
                    return this.setState({ errorEmail: true, errorMessage: 'Die angegebene Email ist ungültig.' });

                case 'auth/user-not-found':
                    return this.setState({ errorEmail: true, errorMessage: 'Es existiert kein Konto mit dieser Email.' });

                default:
                    console.error(error.code, error.message);
                    return this.setState({ errorMessage: 'Unbekannter Fehler. Bitte versuche es erneut.' });

            }

        });

        this.setState({

            passwordResetMessage: true

        });

    }


    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ passwordResetMessage: false });
    }


    handleTextChance = name => event => {

        this.setState({

            [name]: event.target.value

        });

    }


    render() {
        return (


            <MuiThemeProvider theme={theme}>

                <div className="loginBackground">

                    <LinearProgress style={{ display: this.state.loadingBarVisible ? '' : 'none' }} />

                    <div className="loginWrapper">

                        <Paper className="textFieldPaper" >
                            <img src={logo} className="logo" />
                            <br />

                            <TextField
                                error={this.state.errorEmail}
                                id="userResetEmail"
                                label="Email"
                                type="email"
                                className="textField"
                                value={this.state.userResetEmail}
                                onChange={this.handleTextChance('userResetEmail')}
                                margin="normal"
                            />
                            <br />
                            <br />
                        </Paper>
                        <Typography className="loginErrorMessage">
                            {this.state.errorMessage}
                        </Typography>
                        <Button raised className="loginButton" onClick={() => this.handlePasswordReset()}>Passwort zurücksetzen</Button>
                        <br />
                        <Button raised className="cancleButton" onClick={() => this.props.changeMode('login')} >Abbrechen</Button>

                    </div>

                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.passwordResetMessage}
                        autoHideDuration={6000}
                        SnackbarContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">Eine Email mit einen Passwort-Zurücksetz-Link wurde gesendet. Überprüfe deinen Posteingang und klicke auf den Link in der Email</span>}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={this.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                    />

                </div>

            </MuiThemeProvider>



        );
    }
}




export default PasswordReset;
