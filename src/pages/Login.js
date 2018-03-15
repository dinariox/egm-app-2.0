import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';
import './Login.css';

import logo from './../img/egmlogo.svg';
import loginBG from './../img/loginBG.jpg';

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
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import MobileStepper from 'material-ui/MobileStepper';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

import Slide from 'material-ui/transitions/Slide';

import LoginIcon from 'material-ui-icons/ArrowForward';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import CloseIcon from 'material-ui-icons/Close';

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


function Transition(props) {
    return <Slide direction="up" {...props} />;
}


class Login extends Component {

    constructor(props) {

        super(props);
        this.state = {
            pageTitle: "EGM App: Login",

            userEmail: '',
            userPassword: '',
            errorMessage: '',
            errorPassword: false,
            errorEmail: false,

            userRegisterEmail: '',
            userRegisterPassword: '',
            userRegisterPassword2: '',
            userRegisterFirstname: '',
            userRegisterLastname: '',
            userRegisterStufenpasswort: '',
            userRegisterStufe: '',
            errorRegisterMessage: '',
            errorRegisterPassword: false,
            errorRegisterPassword2: false,
            errorRegisterEmail: false,
            errorRegisterFirstname: false,
            errorRegisterLastname: false,
            errorRegisterStufenpasswort: false,
            errorRegisterStufe: false,
            successRegisterMessage: '',

            willBeStufe: '',

            stufenpasswortLoading: false,

            openRegister: false,
            openPasswordReset: false,
            registerActiveStep: 0,
            windowHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
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


    handleRegister() {

        this.setState({

            registerLoadingBarVisible: true,
            errorRegisterEmail: false,
            errorRegisterFirstname: false,
            errorRegisterLastname: false,
            errorRegisterPassword: false,
            errorRegisterPassword2: false,
            errorRegisterStufenpasswort: false
        })

        let email = this.state.userRegisterEmail;
        let password = this.state.userRegisterPassword;
        let password2 = this.state.userRegisterPassword2;
        let firstname = this.state.userRegisterFirstname;
        let lastname = this.state.userRegisterLastname;
        let willBeStufe = this.state.willBeStufe;

        
        if (email === '') {
            return this.setState({ registerLoadingBarVisible: false, errorRegisterMessage: 'Es wurde keine Email angegeben', errorRegisterEmail: true, registerActiveStep: 0 });
        }
        if (password === '') {
            return this.setState({ registerLoadingBarVisible: false, errorRegisterMessage: 'Es wurde kein Passwort angegeben', errorRegisterPassword: true, registerActiveStep: 1 });
        }
        if (password !== password2) {
            return this.setState({ registerLoadingBarVisible: false, errorRegisterMessage: 'Die beiden Passwörter stimmen nicht überein', errorRegisterPassword2: true, registerActiveStep: 1 });
        }
        if (firstname === '') {
            return this.setState({ registerLoadingBarVisible: false, errorRegisterMessage: 'Es wurde kein Vorname angegeben', errorRegisterFirstname: true, registerActiveStep: 2 });
        }
        if (lastname === '') {
            return this.setState({ registerLoadingBarVisible: false, errorRegisterMessage: 'Es wurde kein Nachname angegeben', errorRegisterLastname: true, registerActiveStep: 2 });
        }

        if (willBeStufe === '') {
            if (!window.confirm('Du hast kein Stufenpasswort angegeben oder es nicht überprüfen lassen.\nMöchtest du ohne eingetragene Stufe fortfahren?')) {

                return this.setState({ registerLoadingBarVisible: false });

            }
        }
        

        auth.createUserWithEmailAndPassword(email, password).then(() => {

            this.props.handlePostRegister(firstname, lastname, willBeStufe);

        }).catch((error) => {

            this.setState({

                errorRegisterEmail: false,
                errorRegisterFirstname: false,
                errorRegisterLastname: false,
                errorRegisterPassword: false,
                errorRegisterPassword2: false,
                errorRegisterStufenpasswort: false,
                registerLoadingBarVisible: false

            });

            switch (error.code) {

                case 'auth/invalid-email':
                    return this.setState({ errorRegisterMessage: 'Die Email ist ungültig!', errorRegisterEmail: true, registerActiveStep: 0 });
                case 'auth/email-already-in-use':
                    return this.setState({ errorRegisterMessage: 'Diese Email wird bereits verwendet!', errorRegisterEmail: true, registerActiveStep: 0 });
                case 'auth/operation-not-allowed':
                    return console.error('Operation not allowed!', error.message);
                case 'auth/weak-password':
                    return this.setState({ errorRegisterMessage: 'Das Passwort ist nicht sicher genug!', errorRegisterPassword: true, errorRegisterPassword2: true, registerActiveStep: 1 });

            }

        });



    }


    checkStufenpasswort() {

        this.setState({ stufenpasswortLoading: true, errorRegisterStufenpasswort: false, errorRegisterStufe: false, successRegisterMessage: '', errorRegisterMessage: '' });

        if (this.state.userRegisterStufe === '') {
            this.setState({ stufenpasswortLoading: false, errorRegisterMessage: 'Keine Stufe eingegeben!', errorRegisterStufenpasswort: true });
            return;
        }

        if (parseInt(this.state.userRegisterStufe) < 5 || parseInt(this.state.userRegisterStufe) > 12) {
            this.setState({ stufenpasswortLoading: false, errorRegisterMessage: 'Eingegebene Stufe ungültig!', errorRegisterStufenpasswort: true });
            return;
        }

        if (this.state.userRegisterStufenpasswort === '') {
            this.setState({ stufenpasswortLoading: false, errorRegisterMessage: 'Kein Stufenpasswort eingegeben!', errorRegisterStufenpasswort: true });
            return;
        }

        db.ref('/keys/' + this.state.userRegisterStufe).once('value').then(snapshot => {

            if (this.state.userRegisterStufenpasswort === snapshot.val()) {

                this.setState({ stufenpasswortLoading: false, successRegisterMessage: 'Stufenpasswort für Stufe ' + this.state.userRegisterStufe + ' gültig', willBeStufe: this.state.userRegisterStufe});

            } else {

                this.setState({ stufenpasswortLoading: false, errorRegisterMessage: 'Stufenpasswort für Stufe ' + this.state.userRegisterStufe + ' ungültig' });

            }
            


        }).catch(err => {

            console.warn(err);

        });

    }


    handleTextChance = name => event => {

        this.setState({

            [name]: event.target.value

        });

    }

    handleNext() {
        this.setState({
            registerActiveStep: this.state.registerActiveStep + 1,
        });
    }

    handleBack() {
        this.setState({
            registerActiveStep: this.state.registerActiveStep - 1,
        });
    }


    render() {
        return (


            <MuiThemeProvider theme={theme}>

                <div className="loginBackground" style={{ height: this.state.windowHeight }}>

                    <LinearProgress style={{ display: this.state.loadingBarVisible ? '' : 'none' }} />

                    <Paper elevation={4} className="upperPart" style={{ backgroundImage: `url(${loginBG})`, height: this.state.windowHeight / 2 }} >

                        <div className="verticalCenterBox textCenter">

                            <img src={logo} className="logo" /><br />

                            <input type="email" placeholder="Email" className="loginTextbox" onChange={this.handleTextChance('userEmail')} style={{ borderColor: this.state.errorEmail ? '#EF5350' : 'white' }} /><br />
                            <input type="password" placeholder="Passwort" className="loginTextbox" onChange={this.handleTextChance('userPassword')} style={{ borderColor: this.state.errorPassword ? '#EF5350' : 'white' }} />

                            <Typography className="loginErrorMessage">
                                {this.state.errorMessage}
                            </Typography>

                        </div>

                        <Button variant="fab" aria-label="login" onClick={() => this.handleLogin()} className="fabLogin" style={{ top: this.state.windowHeight / 2 }}>
                            <LoginIcon />
                        </Button>

                    </Paper>


                    <div className="lowerPart" style={{ height: this.state.windowHeight / 2 }}>

                        <div className="verticalCenterBox textCenter">

                            <Typography variant="title" className="lowerTexts">
                                Du hast noch kein Konto?
                            </Typography>
                            <Button className="registerButton" onClick={() => { this.setState({ openRegister: true }) }} >Neues Konto erstellen</Button>
                            
                            <Typography variant="title" className="lowerTexts">
                                Du hast dein Passwort vergessen?
                            </Typography>
                            <Button className="passwordButton" onClick={() => { }}>Passwort zurücksetzen</Button>

                        </div>

                        <Typography variant="caption" className="lowerTexts copyrightText">
                            ©2018{new Date().getFullYear() == 2018 ? '' :  '-' + new Date().getFullYear()} - Evangelisches Gymnasium Meinerzhagen
                        </Typography>

                    </div>

                </div>


                <Dialog fullScreen open={this.state.openRegister} onClose={() => this.setState({openRegister: false})} transition={Transition} >

                    <MobileStepper
                        variant="progress"
                        steps={4}
                        position="static"
                        activeStep={this.state.registerActiveStep}
                        nextButton={
                            this.state.registerActiveStep === 3 ?
                                <Button size="small" onClick={() => this.handleRegister()}>
                                    Fertig
                                    <KeyboardArrowRight />
                                </Button>
                                :
                                <Button size="small" onClick={() => this.handleNext()}>
                                    Weiter
                                    <KeyboardArrowRight />
                                </Button>
                        }
                        backButton={
                            <Button size="small" onClick={() => this.handleBack()} disabled={this.state.registerActiveStep === 0}>
                                <KeyboardArrowLeft />
                                Zurück
                            </Button>
                        }
                    />
                
                    <LinearProgress style={{ display: this.state.registerLoadingBarVisible ? '' : 'none' }} />

                    <Typography variant="headline" className="registerTitle">
                        Registrieren
                    </Typography>

                    <div className="paddingAround textCenter" style={{ display: this.state.registerActiveStep === 0 ? '' : 'none' }}>

                        <Typography paragraph variant="body1" className="lowerTexts registerExplainText">
                            Gib zunächst deine Email Adresse an, mit der du dich Zukunft anmelden kannst.
                        </Typography>
                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Bitte benutze eine gültige Email, damit wir dir helfen können, falls du einmal dein Passwort vergessen solltest.
                        </Typography>

                        <TextField
                            error={this.state.errorRegisterEmail}
                            id="userRegisterEmail"
                            label="Email"
                            type="email"
                            className="registerTextbox"
                            value={this.state.userRegisterEmail}
                            onChange={this.handleTextChance('userRegisterEmail')}
                            margin="normal"
                        />

                        <Typography variant="body1" className="registerErrorMessage">
                            {this.state.errorRegisterMessage}
                        </Typography>

                    </div>

                    <div className="paddingAround textCenter" style={{ display: this.state.registerActiveStep === 1 ? '' : 'none' }}>

                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Jetzt wähle ein Passwort, damit dein Konto sicher vor anderen ist.
                        </Typography>

                        <TextField
                            error={this.state.errorRegisterPassword}
                            id="userRegisterPassword"
                            label="Passwort"
                            type="password"
                            className="registerTextbox"
                            value={this.state.userRegisterPassword}
                            onChange={this.handleTextChance('userRegisterPassword')}
                            margin="normal"
                        /><br />
                        <TextField
                            error={this.state.errorRegisterPassword2}
                            id="userRegisterPassword2"
                            label="Passwort wiederholen"
                            type="password"
                            className="registerTextbox"
                            value={this.state.userRegisterPassword2}
                            onChange={this.handleTextChance('userRegisterPassword2')}
                            margin="normal"
                        />

                        <Typography paragraph variant="body1" className="registerErrorMessage">
                            {this.state.errorRegisterMessage}
                        </Typography>

                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Das Passwort muss mindestens 6 Zeichen lang sein. Für ein sicheres Passwort verwende sowohl große als auch kleine Buchstaben, sowie Zahlen und Sonderzeichen.
                        </Typography>

                    </div>

                    <div className="paddingAround textCenter" style={{ display: this.state.registerActiveStep === 2 ? '' : 'none' }}>

                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Nun kannst du noch deinen Namen eingeben, damit wir dich persönlich begrüßen können und dein Profil vollständig ist.
                        </Typography>

                        <TextField
                            error={this.state.errorRegisterFirstname}
                            id="userRegisterFirstname"
                            label="Vorname"
                            type="text"
                            className="registerTextbox"
                            value={this.state.userRegisterFirstname}
                            onChange={this.handleTextChance('userRegisterFirstname')}
                            margin="normal"
                        />
                        <br />
                        <TextField
                            error={this.state.errorRegisterLastname}
                            id="userRegisterLastname"
                            label="Nachname"
                            type="text"
                            className="registerTextbox"
                            value={this.state.userRegisterLastname}
                            onChange={this.handleTextChance('userRegisterLastname')}
                            margin="normal"
                        />

                        <Typography paragraph variant="body1" className="registerErrorMessage">
                            {this.state.errorRegisterMessage}
                        </Typography>

                    </div>

                    <div className="paddingAround textCenter" style={{ display: this.state.registerActiveStep === 3 ? '' : 'none' }}>

                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Als Letztes kannst du nun noch ein Stufenpasswort eingeben, damit du Funktionen wie den Vertretungsplan nutzen kannst und deine Stufe in deinem Konto gespeichert ist.
                        </Typography>

                        <TextField
                            error={this.state.errorRegisterStufe}
                            id="userRegisterStufe"
                            label="Stufe (5-12)"
                            type="text"
                            className="registerTextbox"
                            value={this.state.userRegisterStufe}
                            onChange={this.handleTextChance('userRegisterStufe')}
                            margin="normal"
                        />

                        <TextField
                            error={this.state.errorRegisterStufenpasswort}
                            id="userRegisterStufenpasswort"
                            label="Stufenpasswort"
                            type="text"
                            className="registerTextbox"
                            value={this.state.userRegisterStufenpasswort}
                            onChange={this.handleTextChance('userRegisterStufenpasswort')}
                            margin="normal"
                        />

                        <Button onClick={() => this.checkStufenpasswort()}>
                            <CircularProgress size={20} className="loaderStufenpasswort" style={{ display: this.state.stufenpasswortLoading ? '' : 'none' }} /> Überprüfen
                        </Button>

                        

                        <Typography paragraph variant="body1" className="registerErrorMessage">
                            {this.state.errorRegisterMessage}
                        </Typography>
                        <Typography paragraph variant="body1" className="registerSuccessMessage">
                            {this.state.successRegisterMessage}
                        </Typography>


                        <Typography variant="body1" className="lowerTexts registerExplainText">
                            Wenn du kein Stufenpasswort hast kannst du die Felder frei lassen und später in den Einstellungen eins hinzufügen.
                        </Typography>

                    </div>

                    <Button className="registerCloseButton" aria-label="Close" onClick={() => this.setState({ openRegister: false })}>
                        <CloseIcon /> Abbrechen
                    </Button>
                
                </Dialog>

            </MuiThemeProvider>



        );
    }
}




export default Login;
