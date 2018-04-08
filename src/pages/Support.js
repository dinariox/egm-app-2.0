import React, { Component, Fragment } from 'react';
import 'typeface-roboto';
import { Link } from 'react-router-dom';

import './../main.css';

import teamImage from './../img/team-bild.jpg';
import sponsorImageEGM from './../img/sponsor-egm.jpg';
import sponsorImageLionsClub from './../img/sponsor-lionsclub.jpg';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import Avatar from 'material-ui/Avatar';

import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

// Own components
import EGMAppBar from './../components/EGMAppBar';


// Firebase References
// import firebase from './../firebase';
// const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();


class Support extends Component {

    constructor() {

        super();

        this.state = {

            pageTitle: 'Support'

        }

    }

    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMAppBar title={this.state.pageTitle} />

                    <div className="appBarSpacer"></div>

                    <Typography style={{ margin: 16, marginBottom: 0 }} variant="headline">Support, Fehler melden und mehr</Typography>

                    <Typography style={{ margin: 16, fontSize: '11.2pt' }}>

                        Du brauchst Hilfe, weil du etwas in der App nicht verstehst? Kein Problem. Du kannst uns gerne eine Email schreiben an: <b>support.app@ev-g-m.de</b> oder tippe einfach unten auf <b>Email schreiben</b>.

                    </Typography>

                    <Typography style={{ margin: 16, fontSize: '11.2pt' }}>
                        Du hast einen Fehler in der App gefunden? Wir würden uns freuen, wenn du uns eine Email an <b>support.app@ev-g-m.de</b> schreibst und uns folgendes möglichst genau mitteilst:
                    </Typography>
                    <ul style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', margin: 16, marginLeft: 0, fontSize: '11.2pt', lineHeight: '1.46429em' }}>
                        <li>Dein Betriebssystem (Android, iOS, Windows, macOS, etc.) und die Version (Android 8.1 Oreo, iOS 11.3, Windows 10, etc.)</li>
                        <li>Datum und Uhrzeit, wann du den Fehler gesehen hast</li>
                        <li>Möglichst genaue Beschreibung was der Fehler ist und wie man ihn rekreiert</li>
                    </ul>

                    <Button variant="raised" style={{ backgroundColor: '#F44336', position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: 24, color: 'white' }}>Email schreiben</Button>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Tipps</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Typography variant="subheading" paragraph>
                                    Die App auf deinem Homescreen
                                </Typography>
                                <Typography paragraph>
                                    Die EGM App ist eine sogenannte Webapp, also eine App die in deinem Browser läuft, wie eine Internetseite.
                                    <br />Um nicht immer in deinen Browser gehen zu müssen kannst du die App zu deinem Homescreen hinzufügen.
                                    <br />Wenn du ein Android oder iOS Gerät benutzt wird dann sogar die Oberfläche vom Browser ausgeblendet, um es wie eine richtige App wirken zu lassen.
                                    <br />
                                    <br /><b>Android (Chrome)</b>
                                </Typography>
                                <ul style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '0.875rem', lineHeight: '1.46429em' }}>
                                    <li>Versichere dich, dass du dich auf der Startseite der App befindest</li>
                                    <li>Tippe oben rechts auf die drei Punkte</li>
                                    <li>Tippe auf 'Zum Startbildschirm hinzufügen'</li>
                                    <li>Anschließen musst du nur noch mit 'Hinzufügen' bestätigen</li>
                                    <li>Nun wird direkt auf dem Startbildschirm eine Verknüpfung hinzugefügt, oder bei neueren Android Versionen wird die App installiert und die findest sie bei deinen anderen Apps in der Appübersicht</li>
                                </ul>
                                <Typography paragraph>
                                    <b>iOS (Safari)</b>
                                </Typography>
                                <ul style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontSize: '0.875rem', lineHeight: '1.46429em' }}>
                                    <li>Versichere dich, dass du dich auf der Startseite der App befindest</li>
                                    <li>Tippe auf das 'Teilen'-Symbol (unten in der Mitte der Leiste)</li>
                                    <li>Tippe auf 'Zum Home-Bildschirm'</li>
                                    <li>Das war's. Du findest das Icon der App nun auf deinem Homescreen</li>
                                </ul>
                                <br />

                                <Typography variant="subheading" paragraph>
                                    Passwort zurücksetzen
                                </Typography>
                                <Typography paragraph>
                                    Wenn du dein Passwort ändern möchtest, melde dich bitte zunächst ab. Tippe dann im Login-Screen auf 'Passwort zurücksetzen'.
                                    <br />Dort kannst du deine Email eingeben und bekommst anschließend eine Email mit einem Reset-Link. Den musst du dann anklicken und dein neues Passwort eingeben.
                                    <br /><i>Hinweis: Der Service ist direkt von Google, deshalb wundere dich bitte nicht, dass dort alles in englischer Sprache steht.</i>
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                </div>


            </MuiThemeProvider>



        );
    }
}



export default Support;
