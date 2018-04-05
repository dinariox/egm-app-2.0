import React, { Component } from "react";
import {
    Route,
    HashRouter
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Plan from "./pages/Plan";
import Kalender from "./pages/Kalender";
import News from "./pages/archiv/News";
import SV from "./pages/archiv/SV";
import Schulleitung from "./pages/archiv/Schulleitung";
import OpenArticle from "./pages/archiv/OpenArticle";
import Stufenbrett from "./pages/stufenbrett/Stufenbrett";
import OpenStufenbrett from "./pages/stufenbrett/OpenStufenbrett";
import Sharens from "./pages/Sharens";
import Stundenplan from "./pages/Stundenplan";
import Mensa from "./pages/Mensa";
import Einstellungen from "./pages/Einstellungen";
import CreateArticle from "./pages/archiv/CreateArticle";
import CreateStufenbrettEintrag from "./pages/stufenbrett/CreateStufenbrettEintrag";

import { CircularProgress } from 'material-ui/Progress';
import firebase from './firebase';


const messaging = firebase.messaging();
const db = firebase.database();
const auth = firebase.auth();

class App extends Component {

    constructor() {

        super();

        this.state = {

            loggedin: undefined,
            mode: 'login',
            loggedinUser: null

        }

    }


    changeMode(newMode) {

        this.setState({
            mode: newMode
        });

    }


    componentWillMount() {

        this.initiateFirebaseMessaging();

        auth.onAuthStateChanged(user => {

            if (user) {

                if (this.state.mode === 'register') {

                    db.ref('/users/').push({
                        uid: user.uid,
                        email: user.email,
                        firstname: this.state.firstname,
                        lastname: this.state.lastname,
                        stufe: this.state.userWillBeStufe || '',
                        preferences: { defaultStundenplanDayView: false, shortcut1: 'vertretungsplan', shortcut2: 'stundenplan', textSize: 11.2 }
                    }).then(() => {
                      
                        this.setState({

                            loggedin: true,
                            loggedinUser: user

                        });
                        
                    });

                } else {

                    this.setState({

                        loggedin: true,
                        loggedinUser: user

                    });

                }

            } else {

                this.setState({

                    loggedin: false,
                    loggedinUser: null

                })

            }

        })

    }


    initiateFirebaseMessaging() {

        // Wenn der Browser keine Benachrichtigungen unterstützt, hat er auch keine
        // Funktion namens 'Notification'.
        // Hier wird geprüft, ob diese Funktion existiert. Wenn nicht, wird returned,
        // um Crashes wegen fehlenden Funktionen zu verhindern.
        // undefined = existiert nichtö

        if (typeof Notification === "undefined") {

            return console.warn('Browser does not support Notifications');

        }


        messaging.onTokenRefresh(() => {

            messaging.getToken().then((token) => {

                console.info("Token has been refreshed");

                db.ref('/tokens').orderByChild('token').equalTo(token).once('value', snapshot => {

                    if (snapshot.exists()) {
                        console.log('Token is already in the database');
                        return;
                    }

                    db.ref('/tokens').push({

                        token: token

                    }).then(() => {
                        console.log('Updated token uploaded to database', token);
                    }).catch((error) => {
                        console.error('Token upload failed', error);
                    });

                });

            });

        });

    }


    render() {

        return (
            <HashRouter>

                { this.state.loggedin ?

                    <div>

                        <Route path="/" exact component={Home} loggedinUser={this.state.loggedinUser} />
                        <Route path="/plan" component={Plan} />
                        <Route path="/kalender" component={Kalender} />
                        <Route path="/archiv/news" exact component={News} />
                        <Route path="/archiv/sv" exact component={SV} />
                        <Route path="/archiv/schulleitung" exact component={Schulleitung} />
                        <Route path="/archiv/open/:mode/:articleID/:rth" exact component={OpenArticle} />
                        <Route path="/archiv/open/:mode/:articleID/:rth/:editMode" exact component={OpenArticle} />
                        <Route path="/archiv/create/:mode" exact component={CreateArticle} />
                        <Route path="/stufenbrett" exact component={Stufenbrett} />
                        <Route path="/stufenbrett/open/:stufe/:articleID" exact component={OpenStufenbrett} />
                        <Route path="/stufenbrett/open/:stufe/:articleID/:editMode" exact component={OpenStufenbrett} />
                        <Route path="/stufenbrett/create/:stufe" exact component={CreateStufenbrettEintrag} />
                        <Route path="/sharens" component={Sharens} />
                        <Route path="/stundenplan" exact component={Stundenplan} />
                        <Route path="/stundenplan/:reopen" component={Stundenplan} />
                        <Route path="/mensa" component={Mensa} />
                        <Route path="/einstellungen" exact component={Einstellungen} />
                        <Route path="/einstellungen/:highlight" component={Einstellungen} />

                    </div>

                :

                    this.state.loggedin === undefined ?
                        
                        <CircularProgress style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%)' }} />

                    :

                        <Login handlePostRegister={(firstname, lastname, userWillBeStufe) => this.setState({ firstname: firstname, lastname: lastname, userWillBeStufe: userWillBeStufe, mode: 'register' })} />

                }

            </HashRouter>
        );

    }

}

export default App;