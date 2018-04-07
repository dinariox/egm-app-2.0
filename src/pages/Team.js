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
import EGMImageBar from './../components/EGMImageBar';


// Firebase References
// import firebase from './../firebase';
// const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();


class Impressum extends Component {

    constructor() {

        super();

        this.state = {

            pageTitle: 'Impressum'

        }

    }

    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMImageBar images={[teamImage]} title={this.state.pageTitle} />

                    <Typography style={{ margin: 16, marginBottom: 0 }} variant="headline">Über das EGM-Medienteam</Typography>

                    <Typography style={{ margin: 16, fontSize: '11.2pt' }}>

                        Das EGM-Medienteam ist eine Gruppe von Schülern, die sich rund um das Entwerfen & Programmieren Deiner EGM-App und um Teile der Homepage kümmern.
                        <br />Das Team ist Teil des EGM-Presseteams, welches auch der Initiator des App-Projekts gewesen ist.
                        <br />
                        <br />Mit Stolz kann man sagen, dass die App ein nahezu 100%-Schüler-Produkt ist 😉

                    </Typography>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Das Team</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Typography paragraph variant="subheading">
                                    Paul Handke (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Paul ist der allgemeine Organisator der App. Seit den Überlegungen einer möglichen EGM-App im Jahre 2015 ist er dabei. Er kümmert sich um alles Organisatorische, liefert Ideen und koordiniert, was in die App hineinkommt, er ist Gründer und Leiter des Medienteams.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Timo Nowak (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Timo leitet die Programmierung der EGM-App. Er ist mit seinen Mitstreitern dafür verantwortlich, dass alle Ideen und Funktionsentwürfe perfekt in die App integriert werden. So konnten bereits viele Funktionen umgesetzt werden und das Projekt sehr erfolgreich vorangetrieben werden.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Marvin Strangfeld (Abiturient)
                                </Typography>
                                <Typography paragraph>
                                    Marvin hat den Grundstein für die App gelegt. Nach Gesprächen und Planungen des Presseteams hat er die erste Version der App designt und programmiert. Wichtige Grundfunktionen wie den digitalen Vertretungsplan konnte er umsetzten.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Leon Bromand (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Leon hat als Redakteur des Teams mit Redaktionsarbeit zu tun. Er ist dafür zuständig, Funktionen der App mit Info-Texten und anderen Beiträgen lebendig zu machen. Darüber hinaus liefert er Unterstützung bei der Organisation.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Ole Beckmann (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Ole ist ebenfalls in der Redaktion der App aktiv. Er hat außerdem bei der Erstellung der verschiedenen Info-Clips mitgewirkt und kümmert sich jetzt mit um die Aktualisierung und Instandhaltung des Support-Bereichs der App.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Julian Klose (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Julian ist unser „Multifunktionswerkzeug“. Er hilft bei der Programmierung der App, ist für die Aktualisierung des mittleren Homepagebereichs verantwortlich und hilft auch in der Redaktion aus.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Till Hammer (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Till unterstützt Timo bei der Programmierung der App. Des Weiteren beschäftigt sich Till mit zusätzlichen noch folgenden Funktionen, die in Zukunft in die App integriert werden.
                                </Typography>
                                <Typography paragraph variant="subheading">
                                    Ben Leitzbach (Q1)
                                </Typography>
                                <Typography paragraph>
                                    Ben ist dafür verantwortlich, dass der mittlere Bereich der Homepage immer aktuell ist. Artikel des Presseteams und anderer schulischen Gruppen sind immer ohne großen Zeitverlust zwischen „Schreiben“ und „Erscheinen“ auf der Homepage.
                                </Typography>
                            </div> 
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Mitmachen</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div>
                                <Typography paragraph>
                                    Du willst mitmachen? Wir sehen gerne neue Gesichter in unserem Team. 
                                    <br />
                                    <br />Wenn Du jemanden aus unserem Team kennst, sprich ihn einfach an. Alternativ kannst Du uns auch an unsere Support-Email schreiben.
                                </Typography>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>


                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Sponsoren</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{ textAlign: 'center', display: 'block' }}>
                            <Typography>
                                Evangelisches Gymnasium Meinerzhagen
                            </Typography>
                            <Avatar style={{ width: 80, height: 80, margin: '8px auto' }} alt="Evangelisches Gymnasium Meinerzhagen" src={sponsorImageEGM} />
                            <Typography style={{ marginTop: 16 }}>
                                Lions Club Meinerzhagen-Kierspe
                            </Typography>
                            <Avatar style={{ width: 80, height: 80, margin: '8px auto' }} alt="Lions Club Meinerzhagen-Kierspe" src={sponsorImageLionsClub} />
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                </div>


            </MuiThemeProvider>



        );
    }
}



export default Impressum;
