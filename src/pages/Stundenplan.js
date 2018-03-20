import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';
import './Stundenplan.css';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Select from 'material-ui/Select';
import IconButton from 'material-ui/IconButton';
import Zoom from 'material-ui/transitions/Zoom';
import Slide from 'material-ui/transitions/Slide';

import EditIcon from 'material-ui-icons/Edit';
import DoneIcon from 'material-ui-icons/Done';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/Add';
import CloseIcon from 'material-ui-icons/Close';


// Own components
import EGMAppBar from './../components/EGMAppBar';

// Firebase References
import firebase from './../firebase';
import { TextField } from 'material-ui';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();

const stundenRows = [
    { stunde: 1, start: '7:40', ende: '8:40' },
    { stunde: 2, start: '8:45', ende: '9:45' },
    { stunde: 3, start: '10:05', ende: '11:05' },
    { stunde: 4, start: '11:10', ende: '12:10' },
    { stunde: 5, start: '13:00', ende: '13:55' },
    { stunde: 6, start: '14:00', ende: '15:00' },
    { stunde: 7, start: '15:05', ende: '16:10' },
    { stunde: 8, start: '16:15', ende: '17:20' }
]

function Transition(props) {
    return <Zoom {...props} />;
}


class Stundenplan extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Stundenplan',

            activeView: 'week',
            stundenEditMode: false,
            stundenEditModeTransition: false,

            openInfo: false,
            openInfoName: '',
            openInfoLehrer: '',
            openInfoShortlehrer: '',
            openInfoAnmerkung: '',
            openInfoRaum: '',

            openEdit: false,
            editStundeFach: {},
            editStundeStunde: '',
            editStundeTag: '',
            userFaecherList: [],
            selectedFach: '',
            selectedVariant: 0,

            setupFaecherList: [],
            setupMode: 'none',
            setupNotFirstTime: false,

            setupFachName: '',
            setupFachShortname: '',
            setupFachLehrer: '',
            setupFachShortlehrer: '',
            setupFachColor: '',
            setupFachTextcolor: '',
            setupFachAnmerkung: '',
            setupFachRaum1: '',
            setupFachRaum2: '',
            setupFachRaum3: '',

            displayNothingToSee: false,

            stundenplanLoaded: false,

            montag: {},
            dienstag: {},
            mittwoch: {},
            donnerstag: {},
            freitag: {}
        };

    }


    componentDidMount() {

        this.loadStundenplan();

    }


    loadStundenplan() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).on('value', (snapshot) => {

            let data = snapshot.val();
            let stundenplanInfo = data[Object.keys(data)[0]].stundenplan;

            if (!stundenplanInfo) {


                this.setState({ activeView: 'setup' });


            } else {

                let stunden = stundenplanInfo.stunden;
                let faecher = stundenplanInfo.faecher;

                for (let day in stunden) {

                    let dayInfo = {};

                    stunden[day].forEach((stunde, stundeIndex) => {

                        if (stunde.shortname) {

                            let invalidStunde = true;

                            faecher.forEach(fach => {

                                let foundFach = fach.shortname === stunde.shortname;

                                if (foundFach) {

                                    dayInfo[stundeIndex] = Object.assign({ variant: stunde.variant }, fach);
                                    invalidStunde = false;

                                }

                            });


                            if (invalidStunde) {

                                db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("child_added", snapshot => {

                                    let refToStunde = '/users/' + snapshot.ref.path.pieces_[1] + '/stundenplan/stunden/' + day + '/' + stundeIndex

                                    db.ref(refToStunde).update({
                                        shortname: '',
                                        variant: 0
                                    });

                                });


                            }

                        }

                    });

                    this.setState({ [day]: dayInfo });

                }

                this.setState({ stundenplanLoaded: true });

            }

        });

    }


    handleClickOpen(openDay, dayString, stundeString) {
        
        if (this.state.activeView === 'editStunden') {

            this.editStunde(openDay, dayString, stundeString);

        } else {

            this.setState({ openInfo: true, openInfoName: openDay.name || '-', openInfoLehrer: openDay.lehrer || '-', openInfoShortlehrer: openDay.shortlehrer || '-', openInfoAnmerkung: openDay.anmerkung || '-', openInfoRaum: openDay.raum[openDay.variant] || '-' });
    
        }

    };

    handleClose = () => {
        this.setState({ openInfo: false });
    };


    switchStundenEditMode() {

        if (this.state.activeView === 'editStunden') {

            this.setState({ stundenEditModeTransition: false });

            setTimeout(() => this.setState({ activeView: 'week' }), 200);

        } else {

            this.setState({ stundenEditModeTransition: true, activeView: 'editStunden' });

        }

    }

    editStunde(openDay, dayString, stundeString) {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value', (snapshot) => {

            let data = snapshot.val();
            let stundenplanInfo = data[Object.keys(data)[0]].stundenplan;

            let faecher = stundenplanInfo.faecher;

            this.setState({ openEdit: true, editStundeFach: openDay || {}, editStundeStunde: stundeString, editStundeTag: dayString, userFaecherList: faecher, selectedFach: openDay.shortname || '', selectedVariant: openDay.variant || 0 });

        }, err => {

            alert('Es ist ein Fehler aufgetreten :(\n Bitte prüfe, ob du mit dem Internet verbunden bist und versuche es erneut')

        });   

    }


    cancleEditingStunde() {

        this.setState({ openEdit: false, editStundeFach: {}, editStundeStunde: '', editStundeTag: '', selectedFach: '', selectedVariant: 0 });

    }


    doneEditingStunde() {

        // TODO: upload changes to db, setState clear everything

        this.setState({ openEdit: false });

        db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("child_added", snapshot => {
            // snapshot.ref.update({ displayName: "New trainer" })

            let refToStunde = '/users/' + snapshot.ref.path.pieces_[1] + '/stundenplan/stunden/' + this.state.editStundeTag + '/' + this.state.editStundeStunde

            console.log(refToStunde);

            if (this.state.selectedFach === '') {

                db.ref(refToStunde).update({
                    shortname: '',
                    variant: 0
                });

            } else {

                db.ref(refToStunde).update({
                    shortname: this.state.selectedFach,
                    variant: this.state.selectedVariant
                });

            }

        });

    }


    handleFachChange = event => {

        this.setState({ selectedFach: event.target.value });

    };

    handleVariantChange = event => {

        this.setState({ selectedVariant: event.target.value });

    };


    getFachByShortname(shortname) {

        let searchedFach;

        this.state.userFaecherList.forEach((fach, fachIndex) => {

            if (fach.shortname === shortname) {

                searchedFach = fach;

            }

        })

        return searchedFach;

    }


    addFach() {

        if (!this.state.setupFachName) {
            return alert('Bitte gib einen Namen für das Fach ein');
        }
        if (!this.state.setupFachShortname) {
            return alert('Bitte gib ein Kürzel für das Fach ein');
        }
        if (!this.state.setupFachColor) {
            return alert('Bitte wähle eine Hintergrundfarbe für das Fach aus');
        }
        if (!this.state.setupFachTextcolor) {
            return alert('Bitte wähle eine Textfarbe für das Fach aus');
        }

        let faecherList = this.state.setupFaecherList;

        let raumList = [''];

        if (this.state.setupFachRaum1) {
            raumList[0] = this.state.setupFachRaum1
        }
        if (this.state.setupFachRaum2) {
            raumList[1] = this.state.setupFachRaum2
        }
        if (this.state.setupFachRaum3) {
            raumList[2] = this.state.setupFachRaum3
        }

        faecherList.push({
            name: this.state.setupFachName,
            shortname: this.state.setupFachShortname,
            lehrer: this.state.setupFachLehrer,
            shortlehrer: this.state.setupFachShortlehrer,
            farbe: this.state.setupFachColor,
            textfarbe: this.state.setupFachTextcolor,
            anmerkung: this.state.setupFachAnmerkung,
            raum: raumList
        })

        this.setState({
            setupFaecherList: faecherList,
            setupMode: 'none',
            setupFachName: '',
            setupFachShortname: '',
            setupFachLehrer: '',
            setupFachShortlehrer: '',
            setupFachColor: '',
            setupFachTextcolor: '',
            setupFachAnmerkung: '',
            setupFachRaum1: '',
            setupFachRaum2: '',
            setupFachRaum3: '',
        })

    }


    cancleAddFach() {

        this.setState({
            setupMode: 'none',
            setupFachName: '',
            setupFachShortname: '',
            setupFachLehrer: '',
            setupFachShortlehrer: '',
            setupFachColor: '',
            setupFachTextcolor: '',
            setupFachAnmerkung: '',
            setupFachRaum1: '',
            setupFachRaum2: '',
            setupFachRaum3: '',
        })

    }


    removeFach(index) {

        let faecherList = this.state.setupFaecherList;

        faecherList.splice(index, 1);

        this.setState({ setupFaecherList: faecherList });

    }


    finishSetup() {

        if (this.state.setupMode === 'add') {
            return alert('Bitte schließe erst das Hinzufügen von dem aktuell geöffneten Fach ab');
        }
        if (this.state.setupFaecherList.length < 1) {
            return alert('Bitte füge mindestens 1 Fach hinzu');
        }

        this.setState({ activeView: 'week' });

        db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("child_added", snapshot => {

            let refToPlan = '/users/' + snapshot.ref.path.pieces_[1] + '/stundenplan/'

            if (this.state.setupNotFirstTime) {

                db.ref(refToPlan).update({
                    faecher: this.state.setupFaecherList
                }).then(() => this.loadStundenplan());

            } else {

                db.ref(refToPlan).set({
                    faecher: this.state.setupFaecherList,
                    stunden: {
                        montag: { 1: { shortname: "", variant: 0 }, 2: { shortname: "", variant: 0 }, 3: { shortname: "", variant: 0 }, 4: { shortname: "", variant: 0 }, 5: { shortname: "", variant: 0 }, 6: { shortname: "", variant: 0 }, 7: { shortname: "", variant: 0 }, 8: { shortname: "", variant: 0 } },
                        dienstag: { 1: { shortname: "", variant: 0 }, 2: { shortname: "", variant: 0 }, 3: { shortname: "", variant: 0 }, 4: { shortname: "", variant: 0 }, 5: { shortname: "", variant: 0 }, 6: { shortname: "", variant: 0 }, 7: { shortname: "", variant: 0 }, 8: { shortname: "", variant: 0 } },
                        mittwoch: { 1: { shortname: "", variant: 0 }, 2: { shortname: "", variant: 0 }, 3: { shortname: "", variant: 0 }, 4: { shortname: "", variant: 0 }, 5: { shortname: "", variant: 0 }, 6: { shortname: "", variant: 0 }, 7: { shortname: "", variant: 0 }, 8: { shortname: "", variant: 0 } },
                        donnerstag: { 1: { shortname: "", variant: 0 }, 2: { shortname: "", variant: 0 }, 3: { shortname: "", variant: 0 }, 4: { shortname: "", variant: 0 }, 5: { shortname: "", variant: 0 }, 6: { shortname: "", variant: 0 }, 7: { shortname: "", variant: 0 }, 8: { shortname: "", variant: 0 } },
                        freitag: { 1: { shortname: "", variant: 0 }, 2: { shortname: "", variant: 0 }, 3: { shortname: "", variant: 0 }, 4: { shortname: "", variant: 0 }, 5: { shortname: "", variant: 0 }, 6: { shortname: "", variant: 0 }, 7: { shortname: "", variant: 0 }, 8: { shortname: "", variant: 0 } }
                    }
                }).then(() => this.loadStundenplan());

            }

            

        });

    }


    reopenSetup() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value', (snapshot) => {

            let data = snapshot.val();
            let stundenplanInfo = data[Object.keys(data)[0]].stundenplan;

            let faecher = stundenplanInfo.faecher;

            this.setState({ activeView: 'setup', setupNotFirstTime: true, setupFaecherList: faecher })

        }, err => {

            alert('Es ist ein Fehler aufgetreten :(\n Bitte prüfe, ob du mit dem Internet verbunden bist und versuche es erneut')

        });   

    }


    render() {

        let { montag, dienstag, mittwoch, donnerstag, freitag } = this.state;
        
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMAppBar title={this.state.activeView === 'editStunden' ? 'Stundenplan bearbeiten' : this.state.pageTitle} stundenplan stundenplanView={this.state.activeView} stundenplanChangeView={(changeTo) => this.setState({ activeView: changeTo })} />

                    <div className="appBarSpacer"></div>

                    
                    { this.state.activeView === 'week' || this.state.activeView === 'editStunden' ?

                        <div>
                            <Grid container spacing={8} style={{ padding: 8, paddingBottom: 0 }}>

                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Std</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Mo</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Di</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Mi</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Do</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography className="timetableItem tableHeader">Fr</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                            </Grid>

                            {this.state.stundenplanLoaded ?

                                <div>

                                    {

                                        stundenRows.map(row => {

                                            return (

                                                <Slide key={row.stunde} direction="up" in={this.state.stundenplanLoaded} style={{ transitionDelay: row.stunde * 80 }}>
                                                    <Grid container spacing={8} style={{ padding: 8, paddingTop: row.stunde === 1 ? 4 : 0, paddingBottom: 4 }}>
                                                        <Grid item xs={2}>
                                                            <Typography className="timetableItem"><b>{row.stunde}</b><br />{row.start}<br />{row.ende}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {!montag[row.stunde] ? this.state.activeView === 'editStunden' ? <Zoom in={this.state.stundenEditModeTransition}><Button variant="raised" onClick={() => this.handleClickOpen({}, 'montag', row.stunde)} className="timetableItem" style={{ backgroundColor: 'white' }}><Typography className="tableItem" style={{ color: '#333' }}><b>&nbsp;</b><br />&nbsp;<br />&nbsp;</Typography></Button></Zoom> : null : <Button variant="raised" onClick={() => this.handleClickOpen(montag[row.stunde], 'montag', row.stunde)} className="timetableItem" style={{ backgroundColor: montag[row.stunde].farbe }}><Typography className="tableItem" style={{ color: montag[row.stunde].textfarbe }}><b>{montag[row.stunde].shortname}</b><br />{montag[row.stunde].shortlehrer || '-'}<br />{montag[row.stunde].raum[montag[row.stunde].variant] || '-'}</Typography></Button>}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {!dienstag[row.stunde] ? this.state.activeView === 'editStunden' ? <Zoom in={this.state.stundenEditModeTransition}><Button variant="raised" onClick={() => this.handleClickOpen({}, 'dienstag', row.stunde)} className="timetableItem" style={{ backgroundColor: 'white' }}><Typography className="tableItem" style={{ color: '#333' }}><b>&nbsp;</b><br />&nbsp;<br />&nbsp;</Typography></Button></Zoom> : null : <Button variant="raised" onClick={() => this.handleClickOpen(dienstag[row.stunde], 'dienstag', row.stunde)} className="timetableItem" style={{ backgroundColor: dienstag[row.stunde].farbe }}><Typography className="tableItem" style={{ color: dienstag[row.stunde].textfarbe }}><b>{dienstag[row.stunde].shortname}</b><br />{dienstag[row.stunde].shortlehrer || '-'}<br />{dienstag[row.stunde].raum[dienstag[row.stunde].variant] || '-'}</Typography></Button>}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {!mittwoch[row.stunde] ? this.state.activeView === 'editStunden' ? <Zoom in={this.state.stundenEditModeTransition}><Button variant="raised" onClick={() => this.handleClickOpen({}, 'mittwoch', row.stunde)} className="timetableItem" style={{ backgroundColor: 'white' }}><Typography className="tableItem" style={{ color: '#333' }}><b>&nbsp;</b><br />&nbsp;<br />&nbsp;</Typography></Button></Zoom> : null : <Button variant="raised" onClick={() => this.handleClickOpen(mittwoch[row.stunde], 'mittwoch', row.stunde)} className="timetableItem" style={{ backgroundColor: mittwoch[row.stunde].farbe }}><Typography className="tableItem" style={{ color: mittwoch[row.stunde].textfarbe }}><b>{mittwoch[row.stunde].shortname}</b><br />{mittwoch[row.stunde].shortlehrer || '-'}<br />{mittwoch[row.stunde].raum[mittwoch[row.stunde].variant] || '-'}</Typography></Button>}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {!donnerstag[row.stunde] ? this.state.activeView === 'editStunden' ? <Zoom in={this.state.stundenEditModeTransition}><Button variant="raised" onClick={() => this.handleClickOpen({}, 'donnerstag', row.stunde)} className="timetableItem" style={{ backgroundColor: 'white' }}><Typography className="tableItem" style={{ color: '#333' }}><b>&nbsp;</b><br />&nbsp;<br />&nbsp;</Typography></Button></Zoom> : null : <Button variant="raised" onClick={() => this.handleClickOpen(donnerstag[row.stunde], 'donnerstag', row.stunde)} className="timetableItem" style={{ backgroundColor: donnerstag[row.stunde].farbe }}><Typography className="tableItem" style={{ color: donnerstag[row.stunde].textfarbe }}><b>{donnerstag[row.stunde].shortname}</b><br />{donnerstag[row.stunde].shortlehrer || '-'}<br />{donnerstag[row.stunde].raum[donnerstag[row.stunde].variant] || '-'}</Typography></Button>}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {!freitag[row.stunde] ? this.state.activeView === 'editStunden' ? <Zoom in={this.state.stundenEditModeTransition}><Button variant="raised" onClick={() => this.handleClickOpen({}, 'freitag', row.stunde)} className="timetableItem" style={{ backgroundColor: 'white' }}><Typography className="tableItem" style={{ color: '#333' }}><b>&nbsp;</b><br />&nbsp;<br />&nbsp;</Typography></Button></Zoom> : null : <Button variant="raised" onClick={() => this.handleClickOpen(freitag[row.stunde], 'freitag', row.stunde)} className="timetableItem" style={{ backgroundColor: freitag[row.stunde].farbe }}><Typography className="tableItem" style={{ color: freitag[row.stunde].textfarbe }}><b>{freitag[row.stunde].shortname}</b><br />{freitag[row.stunde].shortlehrer || '-'}<br />{freitag[row.stunde].raum[freitag[row.stunde].variant] || '-'}</Typography></Button>}
                                                        </Grid>
                                                    </Grid>
                                                </Slide>

                                            );

                                        })

                                    }

                                </div>

                                :

                                null

                            }
                        </div>

                      :

                        this.state.activeView === 'day' ? 

                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', textAlign: 'center' }}>
                                <Typography variant="display2" paragraph style={{ fontWeight: 300 }}>:(</Typography>
                                <Typography variant="headline" style={{ fontWeight: 300 }}>Hier gibt es noch nichts zu sehen</Typography>
                            </div>

                        :

                            this.state.activeView === 'setup' ?

                                <div style={{ position: 'absolute', width: '100%', textAlign: 'center', marginTop: 24 }}>
                                    <Typography variant="headline">Willkommen beim Stundenplan!</Typography>
                                    <Typography variant="body1" style={{ paddingLeft: 8, paddingRight: 8 }} paragraph>Füge unten deine Fächer hinzu und fülle die Informationen aus.</Typography>

                                    <Divider />

                                    <List className="setupFaecherList">

                                        {

                                            this.state.setupFaecherList.length === 0 ?

                                                <Typography variant="body1">Noch keine Fächer vorhanden</Typography>

                                            :

                                                null

                                        }
                                        
                                        {

                                            this.state.setupFaecherList.map((fach, index) => {

                                                return (

                                                    <ListItem button dense key={index}>
                                                        <ListItemText primary={fach.name} />
                                                        <ListItemSecondaryAction>
                                                            <IconButton aria-label="Löschen" onClick={() => this.removeFach(index)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>

                                                );

                                            })

                                        }
                                        
                                    </List>

                                    <Divider />

                                    {

                                        this.state.setupMode === 'none' ?

                                            <Button color="primary" style={{ marginTop: 8 }} onClick={() => this.setState({ setupMode: 'add' })}>
                                                <AddIcon />&nbsp;Fach erstellen
                                            </Button>

                                        :

                                            null

                                    }


                                    {

                                        this.state.setupMode === 'add' ?

                                        <div>

                                            <Grid container spacing={16} style={{ padding: 16 }}>

                                                <Grid item xs={8}>
                                                    <TextField
                                                        id="setupFachName"
                                                        label="Fachname"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachName}
                                                        onChange={(event) => this.setState({ setupFachName: event.target.value })}
                                                        margin="none"
                                                        maxLength="20"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        id="setupFachShortname"
                                                        label="Fachkürzel"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachShortname}
                                                        onChange={(event) => this.setState({ setupFachShortname: event.target.value })}
                                                        margin="none"
                                                        maxLength="4"
                                                    />
                                                </Grid>


                                                <Grid item xs={8}>
                                                    <TextField
                                                        id="setupFachLehrer"
                                                        label="Lehrer"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachLehrer}
                                                        onChange={(event) => this.setState({ setupFachLehrer: event.target.value })}
                                                        maxLength="20"
                                                        margin="none"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        id="setupFachShortlehrer"
                                                        label="Lehrerkürzel"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachShortlehrer}
                                                        onChange={(event) => this.setState({ setupFachShortlehrer: event.target.value })}
                                                        maxLength="4"
                                                        margin="none"
                                                    />
                                                </Grid>

                                                <Grid item xs={4}>
                                                    <TextField
                                                        id="setupFachRaum1"
                                                        label="Raum 1"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachRaum1}
                                                        onChange={(event) => this.setState({ setupFachRaum1: event.target.value })}
                                                        margin="none"
                                                        maxLength="4"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        id="setupFachRaum2"
                                                        label="Raum 2"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachRaum2}
                                                        onChange={(event) => this.setState({ setupFachRaum2: event.target.value })}
                                                        margin="none"
                                                        maxLength="4"
                                                    />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        id="setupFachRaum3"
                                                        label="Raum 3"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachRaum3}
                                                        onChange={(event) => this.setState({ setupFachRaum3: event.target.value })}
                                                        margin="none"
                                                        maxLength="4"
                                                    />
                                                </Grid>


                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="setupFachAnmerkung"
                                                        label="Anmerkungen"
                                                        className="setupTextbox"
                                                        value={this.state.setupFachAnmerkung}
                                                        onChange={(event) => this.setState({ setupFachAnmerkung: event.target.value })}
                                                        margin="none"
                                                        maxLength="150"
                                                    />
                                                </Grid>

                                                {

                                                    ['#D32F2F', '#C2185B', '#7E57C2', '#1565C0', '#388E3C', '#FF7043'].map(color => {

                                                        return (

                                                            <Grid item xs={2} key={color}>
                                                                <IconButton style={{ backgroundColor: color, transition: 'border-color 200ms', border: '4px solid', borderColor: this.state.setupFachColor === color ? '#333' : 'white' }} onClick={() => this.setState({ setupFachColor: color })}></IconButton>
                                                            </Grid>

                                                        );

                                                    })

                                                }

                                                {

                                                    ['#EF5350', '#F06292', '#5C6BC0', '#42A5F5', '#66BB6A', '#FFEE58'].map(color => {

                                                        return (

                                                            <Grid item xs={2} key={color}>
                                                                <IconButton style={{backgroundColor: color, transition: 'border-color 200ms', border: '4px solid', borderColor: this.state.setupFachColor === color ? '#333' : 'white' }} onClick={() => this.setState({ setupFachColor: color })}></IconButton>
                                                            </Grid>

                                                        );

                                                    })

                                                }

                                                <Grid item xs={4}>
                                                    <Typography>Textfarbe:</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <IconButton style={{ backgroundColor: this.state.setupFachColor ? this.state.setupFachColor : '#666', transition: 'border-color 200ms, background-color 200ms', border: '4px solid', borderColor: this.state.setupFachTextcolor === '#f7f7f7' ? '#333' : 'white' }} onClick={() => this.setState({ setupFachTextcolor: '#f7f7f7' })}><Typography variant="title" style={{ color: '#f7f7f7' }}>W</Typography></IconButton>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <IconButton style={{ backgroundColor: this.state.setupFachColor ? this.state.setupFachColor : '#f7f7f7', transition: 'border-color 200ms, background-color 200ms', border: '4px solid', borderColor: this.state.setupFachTextcolor === '#333' ? '#333' : 'white' }} onClick={() => this.setState({ setupFachTextcolor: '#333' })}><Typography variant="title" style={{ color: '#333' }}>S</Typography></IconButton>
                                                </Grid>


                                            </Grid>

                                            <Button color="primary" style={{ marginTop: 8 }} onClick={() => this.cancleAddFach()}>
                                                    <CloseIcon />&nbsp;Abbrechen
                                            </Button>
        
                                            <Button color="primary" style={{ marginTop: 8 }} onClick={() => this.addFach()}>
                                                    <DoneIcon />&nbsp;Fach hinzufügen
                                            </Button>


                                        </div>


                                    :

                                        null

                                }


                                    <Zoom in={this.state.activeView === 'setup'}>
                                        <Button variant="fab" className="stundenplanFAB" style={{ backgroundColor: '#4CAF50'}} onClick={() => this.finishSetup()}>
                                            <DoneIcon />
                                        </Button>
                                    </Zoom>
                                </div>

                            :

                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', textAlign: 'center' }}>
                                    <Button variant="raised" color="primary" onClick={() => this.reopenSetup()}><EditIcon />&nbsp;Fächer bearbeiten</Button>
                                </div>
                        

                    }


                    { this.state.displayNothingToSee && this.state.activeView !== 'settings' ?
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', textAlign: 'center' }}>
                            <Typography variant="display2" paragraph style={{ fontWeight: 300 }}>:(</Typography>
                            <Typography variant="headline" style={{ fontWeight: 300 }}>Hier gibt es noch nichts zu sehen</Typography>
                        </div>
                      :
                        null
                    }
                      

                    <Zoom in={this.state.stundenplanLoaded && this.state.activeView !== 'settings' && this.state.activeView !== 'setup'}>
                        <Button variant="fab" className="stundenplanFAB" style={{ backgroundColor: this.state.activeView === 'editStunden' ? '#4CAF50' : '#EF5350' }} onClick={() => this.switchStundenEditMode()}>
                            { this.state.activeView === 'editStunden' ?
                                <DoneIcon />
                              :
                                <EditIcon />
                            }
                            

                        </Button>
                    </Zoom>


                    {/* STUNDENINFO */}
                    <Dialog
                        open={this.state.openInfo}
                        transition={Transition}
                        keepMounted
                        onClose={this.handleClose}
                        aria-labelledby="dialog-title"
                    >
                        <DialogTitle id="dialog-title">
                            Informationen zu dieser Stunde
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" paragraph>
                                <b>Fach</b>
                                <br />{this.state.openInfoName}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <b>Lehrer</b>
                                <br />{this.state.openInfoLehrer} ({this.state.openInfoShortlehrer})
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <b>Raum</b>
                                <br />{this.state.openInfoRaum}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                <b>Anmerkungen</b>
                                <br />{this.state.openInfoAnmerkung}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Schließen
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {/* STUNDE EDIT */}
                    <Dialog
                        open={this.state.openEdit}
                        onClose={() => this.cancleEditingStunde()}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">{this.state.editStundeTag}, {this.state.editStundeStunde}. Stunde bearbeiten</DialogTitle>
                        <DialogContent>

                            <FormControl>
                                <InputLabel htmlFor="fachSel">Fach</InputLabel>
                                <Select
                                    value={this.state.selectedFach}
                                    onChange={this.handleFachChange}
                                    inputProps={{
                                        name: 'fach',
                                        id: 'fachSel',
                                    }}
                                    className="fachSelect"
                                >
                                    <MenuItem value="">Leer</MenuItem>
                                {
                                    this.state.userFaecherList.map((fach, fachIndex) => {

                                        return (

                                            <MenuItem key={fach.shortname} value={fach.shortname}>{fach.name}</MenuItem>

                                        );

                                    })  
                                }
                                </Select>
                            </FormControl>

                            { this.state.selectedFach !== '' ?

                                <FormControl style={{ marginLeft: 16 }}>
                                    <InputLabel htmlFor="variantSel">Variante</InputLabel>
                                    <Select
                                        value={this.state.selectedVariant}
                                        onChange={this.handleVariantChange}
                                        inputProps={{
                                            name: 'variant',
                                            id: 'variantSel',
                                        }}
                                        className="variantSelect"
                                    >
                                        {

                                            this.getFachByShortname(this.state.selectedFach).raum.map((raum, raumIndex) => {

                                                return (

                                                    <MenuItem key={raumIndex} value={raumIndex}>{raum}</MenuItem>

                                                );

                                            })

                                            
                                            
                                            
                                            
                                        }
                                    </Select>
                                </FormControl>

                              :

                                null

                            }

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.cancleEditingStunde()} color="primary">
                                Abbrechen
                            </Button>
                            <Button onClick={() => this.doneEditingStunde()} color="primary">
                                Bestätigen
                            </Button>
                        </DialogActions>
                    </Dialog>


                </div>


            </MuiThemeProvider>



        );
    }
}




export default Stundenplan;
