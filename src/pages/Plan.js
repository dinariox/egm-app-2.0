import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

// MUI
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import CssBaseline from 'material-ui/CssBaseline';
import Card, { CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Grow from 'material-ui/transitions/Grow';

import CDayIcon from 'material-ui-icons/Today';
import NDayIcon from 'material-ui-icons/Event';

import CheckIcon from 'material-ui-icons/Check';


// Own Components
import EGMAppBar from './../components/EGMAppBar';
import VertretungExpansionPanel from './../components/VertretungExpansionPanel';


// Firebase References
import firebase from './../firebase';
import { relative } from 'path';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();




class Plan extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Vertretungsplan',
            userStufe: 'Q1',
            modeValue: 0,
            growC: true,
            growN: false,
            cDayAbwesendeLehrer: [],
            cDayVertretungen: [],
            cDayUpdatedDate: {},
            cDayForDate: {day: 'lädt...'},
            cDayForDateMonthName: '',
            cDayAbwesendeLehrerReady: false,
            cDayVertretungenReady: false,
            nDayAbwesendeLehrer: [],
            nDayVertretungen: [],
            nDayUpdatedDate: {},
            nDayForDate: { day: 'lädt...' },
            nDayForDateMonthName: '',
            nDayAbwesendeLehrerReady: false,
            nDayVertretungenReady: false
        };

    }


    componentDidMount() {

        db.ref('/vertretungsplan/currentDay/abwesendeLehrer').once('value')
            .then(snapshot => {

                let abwesendeLehrer = snapshot.val();
                this.setState({ cDayAbwesendeLehrer: abwesendeLehrer, cDayAbwesendeLehrerReady: true });

            });

        db.ref('/vertretungsplan/currentDay/vertretungen/' + this.state.userStufe).once('value')
            .then(snapshot => {

                let vertretungen = snapshot.val();

                db.ref('/vertretungsplan/currentDay/forDate').once('value')
                    .then(snapshot => {

                        let forDate = snapshot.val();

                        db.ref('/vertretungsplan/currentDay/updatedDate').once('value')
                            .then(snapshot => {

                                let updatedDate = snapshot.val();
                                this.setState({ cDayUpdatedDate: updatedDate, cDayForDate: forDate, cDayForDateMonthName: this.monthNumericToText(forDate.month), cDayVertretungen: vertretungen, cDayVertretungenReady: true });

                            });

                    });

            });

        db.ref('/vertretungsplan/nextDay/abwesendeLehrer').once('value')
            .then(snapshot => {

                let abwesendeLehrer = snapshot.val();
                this.setState({ nDayAbwesendeLehrer: abwesendeLehrer, nDayAbwesendeLehrerReady: true });

            });

        db.ref('/vertretungsplan/nextDay/vertretungen/' + this.state.userStufe).once('value')
            .then(snapshot => {

                let vertretungen = snapshot.val();

                db.ref('/vertretungsplan/nextDay/forDate').once('value')
                    .then(snapshot => {

                        let forDate = snapshot.val();

                        db.ref('/vertretungsplan/nextDay/updatedDate').once('value')
                            .then(snapshot => {

                                let updatedDate = snapshot.val();
                                this.setState({ nDayUpdatedDate: updatedDate, nDayForDate: forDate, nDayForDateMonthName: this.monthNumericToText(forDate.month), nDayVertretungen: vertretungen, nDayVertretungenReady: true });

                            });

                    });

            });

    }


    monthNumericToText(numericMonth) {

        let monthNames = [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember'
        ]

        return monthNames[parseInt(numericMonth) - 1];

    }



    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <div>

                    <CssBaseline />

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />

                    <div className="appBarSpacer"></div>

                    {/* CDAY */}
                    <Grow style={{ position: 'absolute', width: '100%' }} in={this.state.growC} mountOnEnter unmountOnExit>
                        <div>
                            <Card style={{ marginBottom: 8, minHeight: 160 }}>
                                <CardContent style={{ paddingBottom: 16 }}>

                                    <Typography variant="headline" style={{ textAlign: 'center' }}>
                                        Vertretungen
                                    </Typography>

                                    <Typography variant="body1" style={{ textAlign: 'center', paddingBottom: 10 }}>
                                        {this.state.cDayVertretungenReady ? `für ${this.state.cDayForDate.dayOfWeek}, den ${this.state.cDayForDate.day}. ${this.state.cDayForDateMonthName}` : ''}
                                    </Typography>


                                    {this.state.cDayVertretungenReady ?

                                        this.state.cDayVertretungen ?

                                            this.state.cDayVertretungen.map((vertretung, index) => {

                                                let fa = vertretung.bemerkung.includes('f.a.');

                                                let fehltname = ''

                                                if (vertretung.fehltname.includes('Herr')) {

                                                    let a = vertretung.fehltname;
                                                    let b = "n";
                                                    let position = 4;
                                                    fehltname = a.substr(0, position) + b + a.substr(position);

                                                } else {

                                                    fehltname = vertretung.fehltname;

                                                }

                                                
                                                let stunde = ''

                                                if (vertretung.stunde.charAt(0) == '0') {

                                                    stunde = vertretung.stunde.substr(1, 1); // Die 0 am Anfang wegkürzen

                                                }

                                                return (
                                                    <VertretungExpansionPanel key={index} stunde={stunde} fehltkuerzel={vertretung.fehltkuerzel} fehltname={fehltname} klasse={vertretung.klasse} fach={vertretung.fach} raum={vertretung.raum} vertrittkuerzel={vertretung.vertrittkuerzel} vertrittname={vertretung.vertrittname} bemerkung={vertretung.bemerkung} />
                                                );

                                            })

                                            :

                                            <Typography style={{ fontSize: '14pt', textAlign: 'center' }}>Keine Vertretungen für deine Stufe 😕</Typography>

                                        :

                                        <CircularProgress className="vertretungenLoadingCircle" />

                                    }
                                    {this.state.cDayVertretungenReady ?
                                        <Typography variant="caption" style={{ textAlign: 'center', paddingTop: 16 }}>
                                            
                                                <CheckIcon style={{width: 16, position: 'relative', top: '6px'}} />&nbsp;Aktuellste Version vom {this.state.cDayUpdatedDate.day}.{this.state.cDayUpdatedDate.month}.{this.state.cDayUpdatedDate.year} um {this.state.cDayUpdatedDate.time} Uhr
                                            
                                        </Typography>
                                    : null}


                                </CardContent>

                            </Card>

                            {/* <Card style={{ minHeight: 160 }}>
                                <CardContent>

                                    <Typography variant="headline" style={{ textAlign: 'center' }}>
                                        Abwesende Lehrer
                                </Typography>

                                </CardContent>


                                {this.state.cDayAbwesendeLehrerReady ?
                                    <List style={{ animation: 'fade-in 0.5s forwards' }}>

                                        {this.state.cDayAbwesendeLehrer.map((lehrer, index) => {

                                            return (
                                                <ListItem key={lehrer.kuerzel + index}>
                                                    <Avatar style={{ fontSize: '11pt', borderStyle: 'solid', borderWidth: 2, backgroundColor: 'transparent', color: '#333', borderColor: '#EF5350' }}>
                                                        {lehrer.kuerzel}
                                                    </Avatar>
                                                    <ListItemText primary={lehrer.name} secondary={'Fehlt von der ' + lehrer.start + '. bis zur ' + lehrer.ende + '. Stunde.'} />
                                                </ListItem>
                                            );

                                        })}

                                    </List>

                                    :

                                    <CircularProgress className="abwesendeLehrerLoadingCircle" />

                                }


                            </Card> */}
                        </div>
                    </Grow>

                    {/* NDAY */}
                    <Grow style={{ position: 'absolute', width: '100%' }} in={this.state.growN} mountOnEnter unmountOnExit {...(this.state.growN ? { timeout: 1000 } : {})}>
                        <div>
                            <Card style={{ marginBottom: 8, minHeight: 160 }}>
                                <CardContent style={{ paddingBottom: 16 }}>

                                    <Typography variant="headline" style={{ textAlign: 'center' }}>
                                        Vertretungen
                                </Typography>

                                    <Typography variant="body1" style={{ textAlign: 'center', paddingBottom: 10 }}>
                                        {this.state.nDayVertretungenReady ? `für ${this.state.nDayForDate.dayOfWeek}, den ${this.state.nDayForDate.day}. ${this.state.nDayForDateMonthName}` : ''}
                                    </Typography>


                                    {this.state.nDayVertretungenReady ?

                                        this.state.nDayVertretungen ?

                                            this.state.nDayVertretungen.map((vertretung, index) => {

                                                let fehltname = ''

                                                if (vertretung.fehltname.includes('Herr')) {

                                                    let a = vertretung.fehltname;
                                                    let b = "n";
                                                    let position = 4;
                                                    fehltname = a.substr(0, position) + b + a.substr(position);

                                                } else {

                                                    fehltname = vertretung.fehltname;

                                                }


                                                let stunde = ''

                                                if (vertretung.stunde.charAt(0) == '0') {

                                                    stunde = vertretung.stunde.substr(1, 1); // Die 0 am Anfang wegkürzen

                                                }

                                                return (
                                                    <VertretungExpansionPanel key={index} stunde={stunde} fehltkuerzel={vertretung.fehltkuerzel} fehltname={fehltname} klasse={vertretung.klasse} fach={vertretung.fach} raum={vertretung.raum} vertrittkuerzel={vertretung.vertrittkuerzel} vertrittname={vertretung.vertrittname} bemerkung={vertretung.bemerkung} />
                                                );

                                            })

                                            :

                                            <Typography style={{ fontSize: '14pt', textAlign: 'center' }}>Keine Vertretungen für deine Stufe 😕</Typography>

                                        :

                                        <CircularProgress className="vertretungenLoadingCircle" />

                                    }
                                    {this.state.nDayVertretungenReady ? 
                                        <Typography variant="caption" style={{ textAlign: 'center', paddingTop: 16 }}>
                                            
                                            <CheckIcon style={{ width: 16, position: 'relative', top: '6px' }} />&nbsp;Aktuellste Version vom {this.state.nDayUpdatedDate.day}.{this.state.nDayUpdatedDate.month}.{this.state.nDayUpdatedDate.year} um {this.state.nDayUpdatedDate.time} Uhr
                                            
                                        </Typography>
                                    : null}


                                </CardContent>

                            </Card>

                            {/* <Card style={{ minHeight: 160 }}>
                                <CardContent>

                                    <Typography variant="headline" style={{ textAlign: 'center' }}>
                                        Abwesende Lehrer
                                </Typography>

                                </CardContent>


                                {this.state.nDayAbwesendeLehrerReady ?
                                    <List style={{ animation: 'fade-in 0.5s forwards' }}>

                                        {this.state.nDayAbwesendeLehrer.map((lehrer, index) => {

                                            return (
                                                <ListItem key={lehrer.kuerzel + index}>
                                                    <Avatar style={{ fontSize: '11pt', borderStyle: 'solid', borderWidth: 2, backgroundColor: 'transparent', color: '#333', borderColor: '#EF5350' }}>
                                                        {lehrer.kuerzel}
                                                    </Avatar>
                                                    <ListItemText primary={lehrer.name} secondary={'Fehlt von der ' + lehrer.start + '. bis zur ' + lehrer.ende + '. Stunde.'} />
                                                </ListItem>
                                            );

                                        })}

                                    </List>

                                    :

                                    <CircularProgress className="abwesendeLehrerLoadingCircle" />

                                }


                            </Card> */}
                        </div>
                    </Grow>

                    <div className="bottomNavigationSpacer"></div>

                    <Paper elevation={7} style={{ position: 'fixed', width: '100%', bottom: 0}}>
                        <BottomNavigation value={this.state.modeValue} showLabels>
                            <BottomNavigationAction label={this.state.cDayForDate.day + '. ' + this.state.cDayForDateMonthName} icon={<CDayIcon />} onClick={() => { this.setState({ modeValue: 0, growC: true, growN: false }) }} />
                            <BottomNavigationAction label={this.state.nDayForDate.day + '. ' + this.state.nDayForDateMonthName} icon={<NDayIcon />} onClick={() => { this.setState({ modeValue: 1, growC: false, growN: true }) }} />
                        </BottomNavigation>
                    </Paper>
                    
                </div>

            </MuiThemeProvider>



        );
    }

}




export default Plan;
