import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';

import SettingsIcon from 'material-ui-icons/Settings';
import PlanIcon from 'material-ui-icons/List';
import StundenplanIcon from 'material-ui-icons/DateRange';
import KalenderIcon from 'material-ui-icons/Today';
import StufenbrettIcon from 'material-ui-icons/Dashboard';
import MensaIcon from 'material-ui-icons/LocalPizza';
import NewsIcon from 'material-ui-icons/Whatshot';
import SVIcon from 'material-ui-icons/Portrait';
import SchulleitungIcon from 'material-ui-icons/SpeakerNotes';

import './ShortcutsCard.css';

import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();

class ShortcutsCard extends Component {

    constructor(props) {

        super(props);

        this.state = {
            shortcut1: null,
            shortcut2: null
        };

    }


    componentDidMount() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then(snapshot => {

            let data = snapshot.val();
            let userInfo = data[Object.keys(data)[0]];
            let preferences = userInfo.preferences;

            if (!preferences.shortcut1 || !preferences.shortcut2) {

                db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('child_added', snapshot => {

                    console.log(snapshot);

                    return db.ref('users/' + snapshot.ref_.path.pieces_[1] + '/preferences').update({
                        shortcut1: 'vertretungsplan',
                        shortcut2: 'stundenplan'
                    });

                    let s1name = 'Vertretungsplan';
                    let s1link = '/plan';
                    let s1icon = <PlanIcon />;
                    let s2name = 'Stundenplan';
                    let s2link = '/stundenplan';
                    let s2icon = <StundenplanIcon />;
                    this.setState({ shortcut1: { name: s1name, link: s1link, icon: s1icon }, shortcut2: { name: s2name, link: s2link, icon: s2icon } });

                });

            }

            let s1name, s2name, s1link, s2link, s1icon, s2icon;

            switch (preferences.shortcut1) {
                case 'vertretungsplan':
                    s1name = 'Vertretungsplan';
                    s1link = '/plan';
                    s1icon = <PlanIcon />;
                    break;
                case 'stundenplan':
                    s1name = 'Stundenplan';
                    s1link = '/stundenplan';
                    s1icon = <StundenplanIcon />;
                    break;
                case 'kalender':
                    s1name = 'Kalender';
                    s1link = '/plan';
                    s1icon = <KalenderIcon />;
                    break;
                case 'stufenbrett':
                    s1name = 'Stufenbrett';
                    s1link = '/plan';
                    s1icon = <StufenbrettIcon />;
                    break;
                case 'mensa':
                    s1name = 'Mensa';
                    s1link = '/plan';
                    s1icon = <MensaIcon />;
                    break;
                case 'news':
                    s1name = 'Archiv: News';
                    s1link = '/archiv/news';
                    s1icon = <NewsIcon />;
                    break;
                case 'sv':
                    s1name = 'Archiv: SV';
                    s1link = '/archiv/sv';
                    s1icon = <SVIcon />;
                    break;
                case 'schulleitung':
                    s1name = 'Archiv: Schulleitung';
                    s1link = '/archiv/schulleitung';
                    s1icon = <SchulleitungIcon />;
                    break;
                default:
                    s1name = 'Vertretungsplan';
                    s1link = '/plan';
                    s1icon = <PlanIcon />;
                    break;
            }


            switch (preferences.shortcut2) {
                case 'vertretungsplan':
                    s2name = 'Vertretungsplan';
                    s2link = '/plan';
                    s2icon = <PlanIcon />;
                    break;
                case 'stundenplan':
                    s2name = 'Stundenplan';
                    s2link = '/stundenplan';
                    s2icon = <StundenplanIcon />;
                    break;
                case 'kalender':
                    s2name = 'Kalender';
                    s2link = '/plan';
                    s2icon = <KalenderIcon />;
                    break;
                case 'stufenbrett':
                    s2name = 'Stufenbrett';
                    s2link = '/plan';
                    s2icon = <StufenbrettIcon />;
                    break;
                case 'mensa':
                    s2name = 'Mensa';
                    s2link = '/plan';
                    s2icon = <MensaIcon />;
                    break;
                case 'news':
                    s2name = 'Archiv: News';
                    s2link = '/archiv/news';
                    s2icon = <NewsIcon />;
                    break;
                case 'sv':
                    s2name = 'Archiv: SV';
                    s2link = '/archiv/sv';
                    s2icon = <SVIcon />;
                    break;
                case 'schulleitung':
                    s2name = 'Archiv: Schulleitung';
                    s2link = '/archiv/schulleitung';
                    s2icon = <SchulleitungIcon />;
                    break;
                default:
                    s2name = 'Stundenplan';
                    s2link = '/stundenplan';
                    s2icon = <StundenplanIcon />;
                    break;
            }

            this.setState({ shortcut1: { name: s1name, link: s1link, icon: s1icon }, shortcut2: { name: s2name, link: s2link, icon: s2icon } });

        });

    }


    render() {

        return (

            <Collapse in={Boolean(this.state.shortcut1 && this.state.shortcut2)}>
                <Card className="shortcutCard">

                    <CardContent style={{ padding: 8, paddingBottom: 12 }}>

                        <Grid container>
                        
                            {this.state.shortcut1 && <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to={this.state.shortcut1.link}>{this.state.shortcut1.icon}</IconButton><Typography>{this.state.shortcut1.name}</Typography></Grid>}
                            {this.state.shortcut2 && <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to={this.state.shortcut2.link}>{this.state.shortcut2.icon}</IconButton><Typography>{this.state.shortcut2.name}</Typography></Grid>}
                            <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to="/einstellungen"><SettingsIcon /></IconButton><Typography>Einstellungen</Typography></Grid>

                        </Grid>

                    </CardContent>

                </Card>
            </Collapse>

        );

    }

}

export default ShortcutsCard;