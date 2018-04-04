import React, { Component, Fragment } from 'react';
import 'typeface-roboto';
import { Link } from 'react-router-dom';

import './../main.css';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import List, { ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon, ListSubheader } from 'material-ui/List';
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { LinearProgress, CircularProgress } from 'material-ui/Progress';
import Radio, { RadioGroup } from 'material-ui/Radio';

import EditIcon from 'material-ui-icons/Edit';
import StarIcon from 'material-ui-icons/Star';
import AccessibilityIcon from 'material-ui-icons/Accessibility';
import PhotoIcon from 'material-ui-icons/PhotoCamera';
import TodayIcon from 'material-ui-icons/Today';
import FavoriteIcon from 'material-ui-icons/Favorite';


// Own components
import EGMAppBar from './../components/EGMAppBar';

import ImageTools from './../ImageTools';


// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();


const shortcutOptions = [
    { label: 'Vertretungsplan', value: 'vertretungsplan' },
    { label: 'Stundenplan', value: 'stundenplan' },
    { label: 'Kalender', value: 'kalender' },
    { label: 'Stufenbrett', value: 'stufenbrett' },
    { label: 'Mensa', value: 'mensa' },
    { label: 'Archiv: News', value: 'news' },
    { label: 'Archiv: SV', value: 'sv' },
    { label: 'Archiv: Schulleitung', value: 'schulleitung' }
];



class Einstellungen extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Einstellungen',
            checkedSettings: [],
            swAdminDialog: false,
            swStufeDialog: false,

            newStufe: '',
            newStufenpasswort: '',
            newAdminKey: '',

            newProfilePictureFile: null,
            newProfilePictureURL: '',
            newProfilePictureSize: '',
            uploadPercentage: 0,
            showUploadProgress: false,

            settingsLoaded: false,
            hasStundenplan: false,

            showShortcutDialog1: false,
            showShortcutDialog2: false,

            shortcut1: '',
            shortcut2: ''
        };

    }


    componentDidMount() {

        db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("value", snapshot => {

            let data = snapshot.val();

            let preferences = data[Object.keys(data)[0]].preferences;

            let stundenplan = data[Object.keys(data)[0]].stundenplan;

            if (stundenplan) {

                this.setState({ hasStundenplan: true });

            }

            if (!preferences.shortcut1 || !preferences.shortcut2) {

                let refToSettings = '/users/' + snapshot.ref.path.pieces_[1] + '/preferences'

                db.ref(refToSettings).update({
                    shortcut1: 'vertretungsplan',
                    shortcut2: 'stundenplan'
                });

                return this.setState({
                    settingsLoaded: true, shortcut1: 'vertretungsplan', shortcut2: 'stundenplan'
                });

            }

            if (preferences.defaultStundenplanDayView === undefined) {

                let refToSettings = '/users/' + snapshot.ref.path.pieces_[1] + '/preferences'

                db.ref(refToSettings).update({
                    defaultStundenplanDayView: false
                });

                return this.setState({ settingsLoaded: true, shortcut1: 'vertretungsplan', shortcut2: 'stundenplan' });

            }   

            let defaultStundenplanDayView = preferences.defaultStundenplanDayView;

            this.setState({ checkedSettings: defaultStundenplanDayView ? ['defaultToDayView'] : [], shortcut1: preferences.shortcut1, shortcut2: preferences.shortcut2, settingsLoaded: true });

        });


    }


    handleToggle = value => () => {
        const { checkedSettings } = this.state;
        const currentIndex = checkedSettings.indexOf(value);
        const newChecked = [...checkedSettings];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checkedSettings: newChecked
        });

        db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("child_added", snapshot => {

            let refToSettings = '/users/' + snapshot.ref.path.pieces_[1] + '/preferences/'

            db.ref(refToSettings).update({
                defaultStundenplanDayView: this.state.checkedSettings.indexOf('defaultToDayView') !== -1
            });

        });
    }


    handleClickOpen(dialogName) {
        this.setState({ [dialogName]: true });
    }

    handleClose(dialogName) {
        this.setState({ [dialogName]: false });
    }


    changeShortcut(shortcut, value) {

        this.setState({ [shortcut]: value, showShortcutDialog1: false, showShortcutDialog2: false });

        db.ref("/users/").orderByChild("uid").equalTo(auth.currentUser.uid).once("child_added", snapshot => {

            let refToSettings = '/users/' + snapshot.ref.path.pieces_[1] + '/preferences/'

            db.ref(refToSettings).update({
                [shortcut]: value
            });

        });

    }

    
    switchStufe() {

        if (this.state.newStufe === '') {
            return alert('Bitte gib eine Stufe (5-12 oder lehrer) ein');
        }

        if ((parseInt(this.state.newStufe) < 5 || parseInt(this.state.newStufe) > 12) && this.state.newStufe !== 'lehrer') {
            return alert('Bitte gib eine gültige Stufe (5-12 oder lehrer) ein');
        }

        if (this.state.newStufenpasswort === '') {
            return alert('Bitte gib ein Stufenpasswort ein');
        }

        db.ref('/keys/' + this.state.newStufe).once('value').then(snapshot => {

            if (this.state.newStufenpasswort === snapshot.val()) {

                db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('child_added', snapshot => {

                    db.ref('/users/' + snapshot.ref.path.pieces_[1]).update({

                        stufe: this.state.newStufe

                    }).then(() => {
                        
                        return this.handleClose('swStufeDialog'), alert('Deine Stufe wurde erfolgreich geändert'), this.setState({ newStufe: '', newStufenpasswort: '' });

                    });

                });

            } else {

                return alert('Das Stufenpasswort ist nicht gültig')

            }



        }).catch(err => {

            console.warn(err);

        });

    }


    switchAdmin() {

        if (this.state.newAdminKey === '') {
            return alert('Bitte gib einen Adminschlüssel ein');
        }

        db.ref('/adminkeys/' + this.state.newAdminKey).once('value').then(snapshot => {

            if (!snapshot.exists()) {
                return alert('Dieser Adminschlüssel ist nicht gültig');
            }

            if (snapshot.val().used) {
                return alert('Dieser Adminschlüssel wurde bereits verwendet');
            }

            db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('child_added', snapshot => {

                db.ref('/users/' + snapshot.ref.path.pieces_[1]).update({

                    admin: this.state.newAdminKey

                }).then(() => {

                    db.ref('/adminkeys/' + this.state.newAdminKey).update({

                        used: true

                    }).then(() => {

                        return this.handleClose('swAdminDialog'), alert('Erfolg! Du hast nun Adminrechte'), this.setState({ newAdminKey: '' });

                    }) 

                });

            });



        }).catch(err => {

            console.warn(err);

        });

    }


    confirmProfilePicture(event) {

        if (!event.target.files[0]) {
            return console.log('No files');
        }

        if (!this.checkValidFiletype(event.target.files[0])) {
            return alert('Bitte wähle eine JPG oder PNG Datei');
        }

        console.log(event.target.files[0]);

        ImageTools.resize(event.target.files[0], { width: 350, height: 350 }, function (blob, didItResize) {

            console.log(didItResize, blob);

            this.setState({ newProfilePictureFile: blob, newProfilePictureURL: window.URL.createObjectURL(blob), newProfilePictureSize: this.getFilesize(blob), chProfilePictureDialog: true })

        }.bind(this));


    }


    checkValidFiletype (file) {
        var fileTypes = [
            'image/png',
            'image/jpeg'
        ];

        for (var i = 0; i < fileTypes.length; i++) {
            if (file.type === fileTypes[i]) {
                return true;
            }
        }

        return false;
    }


    getFilesize (file) {
        var number = file.size

        if (number < 1024) {
            return number + ' Bytes';
        } else if (number > 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + ' KB';
        } else if (number > 1048576) {
            return (number / 1048576).toFixed(1) + ' MB';
        }

    }


    uploadProfilePicture() {

        let uploadTask = storage.ref('profilePictures/' + auth.currentUser.uid).put(this.state.newProfilePictureFile);

        this.setState({ newProfilePictureFile: null, newProfilePictureURL: '', newProfilePictureSize: '', chProfilePictureDialog: false, showUploadProgress: true });

        uploadTask.on('state_changed', function (snapshot) {

            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.setState({ uploadPercentage: progress })

        }.bind(this), error => {

            switch (error.code) {

                case 'storage/unauthorized':
                    return alert('Es fehlen Recht zum Hochladen.');

                case 'storage/canceled':
                    return alert('Das Hochladen wurde durch Dich abgebrochen.');

                case 'storage/unknown':
                    return alert('Es ist ein unbekannter Fehler aufgetreten. Versuche es später erneut.');

            }

        }, () => {

            auth.currentUser.updateProfile({

                photoURL: uploadTask.snapshot.downloadURL

            }).then(() => {

                this.setState({ showUploadProgress: false, uploadPercentage: 0 });
                return alert('Dein Profilbild wurde erfolgreich aktualisiert');

            }).catch(error => {

                this.setState({ showUploadProgress: false, uploadPercentage: 0 });
                return alert('Das Profilbild konnte leider nicht aktualisiert werden\n\n' + error.message);

            });

        })

    }


    shortcutValueToDisplayName(value) {

        const names = {
            vertretungsplan: 'Vertretungsplan',
            stundenplan: 'Stundenplan',
            kalender: 'Kalender',
            stufenbrett: 'Stufenbrett',
            mensa: 'Mensa',
            news: 'Archiv: News',
            sv: 'Archiv: SV',
            schulleitung: 'Archiv: Schulleitung'
        }

        return names[value] || 'Lädt...';

    }


    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMAppBar title={this.state.pageTitle} />
                    <div className="appBarSpacer"></div>


                    <List subheader={<ListSubheader>Allgemein</ListSubheader>}>

                        <ListItem button onClick={() => this.handleClickOpen('showShortcutDialog1')} disabled={!this.state.shortcut1}>
                            <ListItemIcon>
                                {this.state.shortcut1 ?
                                    <FavoriteIcon />
                                    :
                                    <CircularProgress size={24} />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Shortcut 1 ändern" secondary={this.shortcutValueToDisplayName(this.state.shortcut1)} />
                        </ListItem>

                        <ListItem button onClick={() => this.handleClickOpen('showShortcutDialog2')} disabled={!this.state.shortcut2}>
                            <ListItemIcon>
                                {this.state.shortcut2 ?
                                    <FavoriteIcon />
                                    :
                                    <CircularProgress size={24} />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Shortcut 2 ändern" secondary={this.shortcutValueToDisplayName(this.state.shortcut2)} />
                        </ListItem>

                    </List>


                    <List subheader={<ListSubheader style={{ transformOrigin: 'left', animation: this.props.match.params.highlight === 'konto' ? 'flashRed 600ms ease-in-out 750ms' : '' }}>Konto</ListSubheader>}>

                        <input onClick={(event) => { event.target.value = null }} onChange={(event) => this.confirmProfilePicture(event)} accept="image/png, image/jpeg" id="profile-picture-upload" type="file" style={{ display: 'none' }} />
                        <label htmlFor="profile-picture-upload">
                            <ListItem button>
                                <ListItemIcon>
                                    <PhotoIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profilbild ändern" />
                            </ListItem>
                        </label>

                        <ListItem button onClick={() => this.handleClickOpen('swStufeDialog')}>
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText primary="Stufe ändern" secondary="Neues Stufenpasswort eingeben um die Stufe zu wechseln" />
                        </ListItem>

                        <ListItem button onClick={() => this.handleClickOpen('swAdminDialog')}>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText primary="Adminstatus erhalten" secondary="Adminschlüssel einlösen um Rechte zu bekommen" />
                        </ListItem>

                    </List>


                    <List subheader={<ListSubheader style={{ transformOrigin: 'left', animation: this.props.match.params.highlight === 'stundenplan' ? 'flashRed 600ms ease-in-out 750ms' : '' }}>Stundenplan</ListSubheader>}>

                        <ListItem button onClick={this.handleToggle('defaultToDayView')} disabled={!this.state.settingsLoaded}>
                            <ListItemIcon>
                                { this.state.settingsLoaded ?
                                    <TodayIcon />
                                  :
                                    <CircularProgress size={24} />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Standardmäßig die Tagesansicht anzeigen" />
                            <ListItemSecondaryAction>
                                <Switch color="primary"
                                    onChange={this.handleToggle('defaultToDayView')}
                                    checked={this.state.checkedSettings.indexOf('defaultToDayView') !== -1}
                                    disabled={!this.state.settingsLoaded}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>

                        <ListItem button component={Link} to="/stundenplan/reopen" disabled={!this.state.settingsLoaded || !this.state.hasStundenplan}>
                            <ListItemIcon>
                                {this.state.settingsLoaded ?
                                    <EditIcon />
                                    :
                                    <CircularProgress size={24} />
                                }
                            </ListItemIcon>
                            <ListItemText primary="Fächer bearbeiten" secondary="Fächer hinzufügen, bearbeiten und entfernen" />
                        </ListItem>

                    </List>

                </div>

                


                {/* SWITCH STUFE */}
                <Dialog
                    open={this.state.swStufeDialog}
                    onClose={() => this.handleClose('swStufeDialog')}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Stufe ändern</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Wenn du die registrierte Stufe in deinem Konto ändern möchtest, gib unten die Stufe und das Stufenpasswort der neuen Stufe ein.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="stufe"
                            label="Stufe"
                            type="text"
                            value={this.state.newStufe}
                            onChange={(event) => this.setState({ newStufe: event.target.value })}
                            fullWidth
                        />
                        <TextField
                            margin="dense"
                            id="stufenpw"
                            label="Stufenpasswort"
                            type="password"
                            value={this.state.newStufenpasswort}
                            onChange={(event) => this.setState({ newStufenpasswort: event.target.value })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose('swStufeDialog')} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={() => this.switchStufe()} color="primary">
                            Ändern
                        </Button>
                    </DialogActions>
                </Dialog>


                {/* SWITCH ADMIN */}
                <Dialog
                    open={this.state.swAdminDialog}
                    onClose={() => this.handleClose('swAdminDialog')}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Adminschlüssel einlösen</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Wenn du einen Adminschlüssel besitzt, kannst du ihn hier einlösen. Achtung: Der Schlüssel kann nur ein mal verwendet werden!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="adminkey"
                            label="Adminschlüssel"
                            type="password"
                            value={this.state.newAdminKey}
                            onChange={(event) => this.setState({ newAdminKey: event.target.value })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose('swAdminDialog')} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={() => this.switchAdmin()} color="primary">
                            Ändern
                        </Button>
                    </DialogActions>
                </Dialog>



                {/* CHANGE PROFILE PICTURE */}
                <Dialog
                    open={this.state.chProfilePictureDialog}
                    onClose={() => this.handleClose('chProfilePictureDialog')}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Profilbild ändern</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Möchtest du dein Profilbild in folgendes ändern?
                        </DialogContentText>
                        <img src={this.state.newProfilePictureURL} style={{ width: '100%', maxWidth: 350 }} />
                        <DialogContentText>
                            {this.state.newProfilePictureSize}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose('chProfilePictureDialog')} color="primary">
                            Abbrechen
                        </Button>
                        <Button onClick={() => this.uploadProfilePicture()} color="primary">
                            Ändern
                        </Button>
                    </DialogActions>
                </Dialog>



                {/* UPLOAD PROFILE PICTURE PROGRESS */}
                <Dialog
                    aria-labelledby="simple-modal-title"
                    open={this.state.showUploadProgress}
                >
                    <DialogTitle id="form-dialog-title">Profilbild hochladen...</DialogTitle>
                    <DialogContent>
                        <LinearProgress variant="determinate" value={this.state.uploadPercentage} />
                        <DialogContentText>
                            {this.state.uploadPercentage}%
                        </DialogContentText>
                    </DialogContent>
                </Dialog>



                {/* CHANGE SHORTCUT */}
                { this.state.shortcut1 && <ChangeShortcutDialog
                    open={this.state.showShortcutDialog1}
                    onClose={value => this.changeShortcut('shortcut1', value)}
                    value={this.state.shortcut1}
                /> }

                { this.state.shortcut2 &&<ChangeShortcutDialog
                    open={this.state.showShortcutDialog2}
                    onClose={value => this.changeShortcut('shortcut2', value)}
                    value={this.state.shortcut2}
                /> }


            </MuiThemeProvider>



        );
    }
}



class ChangeShortcutDialog extends Component {

    constructor(props, context) {
        super(props, context);

        this.state.value = this.props.value;
    }


    state = {};


    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    radioGroup = null;

    handleEntering = () => {
        this.radioGroup.focus();
    };

    handleCancel = () => {
        this.props.onClose(this.props.value);
    };

    handleOk = () => {
        this.props.onClose(this.state.value);
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {

        const { value, ...other } = this.props;

        return (

            <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth = "xs"
                onEntering = { this.handleEntering }
                aria-labelledby="confirmation-dialog-title"
                {...other }
            >
                <DialogTitle id="confirmation-dialog-title">Shortcut auswählen</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        ref={node => {
                            this.radioGroup = node;
                        }}
                        aria-label="shortcut"
                        name="shortcut"
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        {shortcutOptions.map(option => (
                            <FormControlLabel value={option.value} key={option.value} control={<Radio color="primary" />} label={option.label} />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleOk} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog >

        );

    }

}



export default Einstellungen;
