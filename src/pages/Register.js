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
import TextField from 'material-ui/TextField';
import { LinearProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';

// MUI icons


// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();

// Colors
// const primary = blue;
// const secondary = blueGrey;

// const primaryColor = '#01579B';
// const secondaryColor = '#C62828';




class Register extends Component {

    constructor(props) {

        super(props);
        this.state = {
            pageTitle: "EGM App: Register",
            userRegisterEmail: '',
            userRegisterPassword: '',
            userRegisterPassword2: '',
            userRegisterFirstname: '',
            userRegisterLastname: '',
            errorMessage: '',
            errorPassword: false,
            errorPassword2: false,
            errorEmail: false,
            errorFirstname: false,
            errorLastname: false
        };

    }


    handleRegister() {

        this.setState({

            loadingBarVisible: true,
            errorEmail: false,
            errorFirstname: false,
            errorLastname: false,
            errorPassword: false,
            errorPassword2: false
        })

        let email = this.state.userRegisterEmail;
        let password = this.state.userRegisterPassword;
        let password2 = this.state.userRegisterPassword2;
        let firstname = this.state.userRegisterFirstname;
        let lastname = this.state. userRegisterLastname;


        if (firstname === '') {
            return this.setState({ loadingBarVisible: false, errorMessage: 'Es wurde kein Vorname angegeben', errorFirstname: true });
        }
        if (lastname === '') {
            return this.setState({ loadingBarVisible: false, errorMessage: 'Es wurde kein Nachname angegeben', errorLastname: true });
        }
        if (email === '') {
            return this.setState({ loadingBarVisible: false, errorMessage: 'Es wurde keine Email angegeben', errorEmail: true });
        }
        if (password === '') {
            return this.setState({ loadingBarVisible: false, errorMessage: 'Es wurde kein Passwort angegeben', errorPassword: true });
        }
        if (password !== password2) {
            return this.setState({ loadingBarVisible: false, errorMessage: 'Die beiden Passwörter stimmen nicht überein', errorPassword2: true });
        }


        auth.createUserWithEmailAndPassword(email, password).then(() => {

            this.props.handlePostRegister(firstname, lastname);

        }).catch((error) => {

            this.setState({

                errorEmail: false,
                errorFirstname: false,
                errorLastname: false,
                errorPassword: false,
                errorPassword2: false,
                loadingBarVisible: false

            });

            switch (error.code) {

                case 'auth/invalid-email':
                    return this.setState({ errorMessage: 'Die Email ist ungültig!', errorEmail: true });
                case 'auth/email-already-in-use':
                    return this.setState({ errorMessage: 'Diese Email wird bereits verwendet!', errorEmail: true });
                case 'auth/operation-not-allowed':
                    return console.error('Operation not allowed!', error.message);
                case 'auth/weak-password':
                    return this.setState({ errorMessage: 'Das Passwort ist nicht sicher genug!', errorPassword: true, errorPassword2: true });

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
                                error={this.state.errorFirstname}
                                id="userRegisterFirstname"
                                label="Vorname"
                                type="text"
                                className="textField"
                                value={this.state.userRegisterFirstname}
                                onChange={this.handleTextChance('userRegisterFirstname')}
                                margin="normal"
                            />
                            <br />
                            <TextField
                                error={this.state.errorLastname}
                                id="userRegisterLastname"
                                label="Nachname"
                                type="text"
                                className="textField"
                                value={this.state.userRegisterLastname}
                                onChange={this.handleTextChance('userRegisterLastname')}
                                margin="normal"
                            />
                            <br />
                            <TextField
                                error={this.state.errorEmail}
                                id="userRegisterEmail"
                                label="Email"
                                type="email"
                                className="textField"
                                value={this.state.userRegisterEmail}
                                onChange={this.handleTextChance('userRegisterEmail')}
                                margin="normal"
                            />
                            <br />
                            <TextField
                                error={this.state.errorPassword}
                                id="userRegisterPassword"
                                label="Passwort"
                                type="password"
                                className="textField"
                                value={this.state.userRegisterPassword}
                                onChange={this.handleTextChance('userRegisterPassword')}
                                margin="normal"
                            />
                            <br />
                            <TextField
                                error={this.state.errorPassword2}
                                id="userRegisterPassword2"
                                label="Passwort wiederholen"
                                type="password"
                                className="textField"
                                value={this.state.userRegisterPassword2}
                                onChange={this.handleTextChance('userRegisterPassword2')}
                                margin="normal"
                            />
                            <br />
                            <br />
                        </Paper>

                        <Typography className="loginErrorMessage">
                            {this.state.errorMessage}
                        </Typography>
                        <Button raised className="loginButton" onClick={() => this.handleRegister()}>Registrieren</Button>
                        <br />
                        <Button raised className="cancleButton" onClick={() => this.props.changeMode('login')}>Abbrechen</Button>

                    </div>
                </div>

            </MuiThemeProvider>



        );
    }
}




export default Register;
