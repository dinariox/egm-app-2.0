import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';
import './Login.css';

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
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Paper from 'material-ui/Paper';

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




class Login extends Component {

    constructor(props) {

        super(props);
        this.state = {
            pageTitle: "EGM App: Login",
            userEmail: '',
            userPassword: '',
            errorMessage: '',
            errorPassword: false,
            errorEmail: false
        };

    }


    handleLogin() {

        this.setState({

            loadingBarVisible: true

        })

        let email = this.state.userEmail;
        let password = this.state.userPassword;

        auth.signInWithEmailAndPassword(email, password).catch((error) => {

            this.setState({

                errorEmail: false,
                errorPassword: false,
                loadingBarVisible: false,
                passwordResetMessage: false

            });

            switch (error.code) {

                case 'auth/invalid-email':
                    return this.setState({ errorMessage: 'Die Email ist ungültig!', errorEmail: true});
                case 'auth/user-disabled':
                    return this.setState({ errorMessage: 'Das Konto mit dieser Email ist gesperrt! Bitte wende dich an den Administrator.' });
                case 'auth/user-not-found':
                    return this.setState({ errorMessage: 'Es existiert kein Konto mit dieser Email!', errorEmail: true });
                case 'auth/wrong-password':
                    return this.setState({ errorMessage: 'Das Passwort ist falsch!', errorPassword: true });

            }

        });

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
                                id="userEmail"
                                label="Email"
                                type="email"
                                className="textField"
                                value={this.state.userEmail}
                                onChange={this.handleTextChance('userEmail')}
                                margin="normal"
                            />
                            <br />
                            <TextField
                                error={this.state.errorPassword}
                                id="userPassword"
                                label="Passwort"
                                type="password"
                                className="textField"
                                value={this.state.userPassword}
                                onChange={this.handleTextChance('userPassword')}
                                margin="normal"
                            />
                            <br />
                            <br />
                        </Paper>

                        <Typography className="loginErrorMessage">
                            {this.state.errorMessage}
                        </Typography>
                        <Button raised className="loginButton" onClick={() => this.handleLogin()}>Einloggen</Button>
                        <br />
                        <Button raised className="registerButton" onClick={() => this.props.changeMode('register')} >Neues Konto erstellen</Button>
                        <br />
                        <Button raised className="passwordButton" onClick={() => this.props.changeMode('reset')}>Passwort zurücksetzen</Button>

                    </div>

                </div>

            </MuiThemeProvider>



        );
    }
}




export default Login;
