import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './EGMAppBar.css';

import SwipeableDrawer from 'material-ui/SwipeableDrawer';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Card, { CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import { CircularProgress } from 'material-ui';


import StartIcon from 'material-ui-icons/Explore';
import PlanIcon from 'material-ui-icons/List';
import StundenplanIcon from 'material-ui-icons/DateRange';
import KalenderIcon from 'material-ui-icons/Today';
import StufenbrettIcon from 'material-ui-icons/Dashboard';
import MensaIcon from 'material-ui-icons/LocalPizza';
import ArchivIcon from 'material-ui-icons/SpeakerNotes';
import SharensIcon from 'material-ui-icons/Loyalty';
import ExpandIcon from 'material-ui-icons/ExpandMore';
import SettingsIcon from 'material-ui-icons/Settings';
import HelpIcon from 'material-ui-icons/Help';
import NotificationsIcon from 'material-ui-icons/Notifications';
import TodayViewIcon from 'material-ui-icons/ViewDay';
import WeekViewIcon from 'material-ui-icons/ViewWeek';
import CloseIcon from 'material-ui-icons/Close';
// import NotificationsActiveIcon from 'material-ui-icons/NotificationsActive';

import personImg from './../img/person.jpg';
import cardImage from './../img/polyMenuBackgroundBlue.jpg';

// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
const messaging = firebase.messaging();
// const storage = firebase.storage();


const primaryColor = '#01579B';

const scrollDistanceUntilSolidAppbar = 164; // px




class EGMAppBar extends Component {

    constructor(props) {

        super(props);

        if (this.props.imageMode) {

            this.state = { background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.15) 15%,rgba(0,0,0,0) 100%)', shadow: 'none', transition: 'background 200ms, box-shadow 200ms', transparent: true, checkedNotifications: false};

            this.checkScroll = this.checkScroll.bind(this);

        } else {

            this.state = {background: primaryColor, shadow: '', checkedNotifications: false};

        }

    }

    checkScroll() {

        if (window.scrollY >= scrollDistanceUntilSolidAppbar) {
            this.setState({background: primaryColor, shadow: '', transparent: false});
        } else {
            this.setState({ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.15) 15%,rgba(0,0,0,0) 100%)', shadow: 'none', transparent: true});
        }

    }

    componentDidMount(){

        if (this.props.imageMode) {
            window.addEventListener('scroll', this.checkScroll);
        }

        db.ref('/tokens/' + auth.currentUser.uid).once('value', snapshot => {

            if (snapshot.exists()) {
                
                this.setState({ checkedNotifications: true });
                return;

            }

        });

    }

    componentWillUnmount(){

        if (this.props.imageMode) {
            window.removeEventListener('scroll', this.checkScroll);
        }

    }


    switchNotifications = event => {

        if (event.target.checked) {
            this.activateNotifications();
        } else {
            this.setState({ checkedNotifications: false });
            db.ref('/tokens/' + auth.currentUser.uid).remove();
        }

    }

    
    activateNotifications() {

        messaging.requestPermission()
            .then(() => {
                console.log('Notification permission granted.');
                this.setState({ checkedNotifications: true });
                return messaging.getToken();
            })
            .then(token => {

                db.ref('/tokens').orderByChild('token').equalTo(token).once('value', snapshot => {

                    if (snapshot.exists()) {
                        console.log('Token is already in the database');
                        return;
                    }

                    db.ref('/tokens/' + auth.currentUser.uid).set({

                        token: token

                    }).then(() => {
                        console.log('Token uploaded to database', token);
                    }).catch((error) => {
                        console.error('Token upload failed', error);
                    });

                });


            })
            .catch(err => {

                if (err.code === 'messaging/permission-blocked') {

                    this.setState({ checkedNotifications: false });
                    return alert('Die Berechtigung Push-Benachrichtungen zu senden wurde blockiert!\nUm Benachrichtungen nutzen zu können gehe in die Einstellungen deines Browsers und lösche die EGM App aus der Blockierten-Liste');

                }

                console.log('FCM Error:', err);
                this.setState({ checkedNotifications: false });

            });

    }


    render() {

        return (
            <div className="root">
                <AppBar position="fixed" style={{ background: this.props.stundenplanView === 'editStunden' || this.props.stundenplanView === 'settings'  ? '#EF5350' : this.state.background, boxShadow: this.state.shadow, transition: this.props.imageMode ? this.state.transition : 'background 200ms' }}>
                    <Toolbar>
                        <MenuDrawerLeft ref="menuDrawerLeft" />
                        <Typography variant="title" color="inherit" className="flex" style={this.state.transparent ? { opacity: 0, transition: 'opacity 200ms' } : { opacity: 1, transition: 'opacity 200ms'} }>
                            {
                                this.state.transparent ?

                                    ''

                                    :
                                    
                                    this.props.stundenplanView === 'settings' ?

                                        'Stundenplan-Optionen'

                                        :

                                        this.props.title
                                        
                                }
                        </Typography>

                        { this.props.stundenplan ?

                            this.props.stundenplanView === 'week' ?
                                <IconButton className="notificationButton" color="secondary" aria-label="Zu Tagesansicht" onClick={() => this.props.stundenplanChangeView('day')}>
                                    <TodayViewIcon />
                                </IconButton>
                            :

                                this.props.stundenplanView === 'day' ?

                                    <IconButton className="notificationButton" color="secondary" aria-label="Zu Wochenansicht" onClick={() => this.props.stundenplanChangeView('week')}>
                                        <WeekViewIcon />
                                    </IconButton>
                                :
                                    
                                    this.props.stundenplanView === 'editStunden' ?

                                        <IconButton className="notificationButton" color="secondary" aria-label="Zu den Einstellungen" component={Link} to="/einstellungen/stundenplan">
                                            <SettingsIcon />
                                        </IconButton>

                                    :

                                        this.props.stundenplanView === 'setup' ?

                                            null

                                        :

                                            <IconButton className="notificationButton" color="secondary" aria-label="Einstellungen schließen" onClick={() => this.props.stundenplanChangeView('editStunden')}>
                                                <CloseIcon />
                                            </IconButton>

                          :

                            <IconButton className="notificationButton" color="secondary" aria-label="Benachrichtigungen" onClick={() => this.setState({ openNotifications: true })}>
                                <NotificationsIcon />
                            </IconButton>
                        }
                    </Toolbar>
                </AppBar>

                <Dialog open={this.state.openNotifications} onClose={() => this.setState({ openNotifications: false })} aria-labelledby="form-dialog-title">

                        <DialogTitle>Push-Benachrichtigungen</DialogTitle>

                        <DialogContent>

                            <Typography variant="body1" paragraph>
                                Push-Benachrichtigungen funktionieren momentan leider nur auf Android-Smartphones, Windows PC und Macs.<br />
                                Um sie zu aktivieren tippe auf den Schalter unten und erlaube Benachrichtigungen in dem Dialogfeld, das dein Browser öffnet.
                            </Typography>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.checkedNotifications}
                                        onChange={this.switchNotifications}
                                        value="checkedNotifications"
                                        color="primary"
                                    />
                                }
                                label="Push-Benachrichtigungen aktivieren"
                            />
                        </DialogContent>

                </Dialog>

                

            </div>
        );

    }

}


const cardStyle = {
    minWidth: '275px',
    backgroundImage: cardImage,
    backgroundSize: 'cover'
}


class ProfileDisplay extends Component {

    constructor() {

        super();

        this.state = {

            profileImage: personImg

        }

    }

    componentDidMount() {

        this.setState({ profileImage: auth.currentUser.photoURL || personImg });

    }

    render() {

        return (
            <div>
                <Card style={{
                    minWidth: '275px',
                    backgroundImage: 'url(' + cardImage + ')',
                    backgroundSize: 'cover',
                    backgroundColor: '#abc',
                    borderRadius: '0px'}}>
                    <CardContent>
                        <div style={{display: 'flex', width: '100%'}}>
                            <Typography variant="title" style={{color: '#fff'}}>EGM App</Typography>
                            <div className="iconButtonsWrapper">
                                <IconButton color="secondary" component={Link} to="/einstellungen"><SettingsIcon /></IconButton>
                                <IconButton color="secondary"><HelpIcon /></IconButton>
                            </div>
                        </div>
                        <div className="userInfoWrapper">
                            <IconButton component={Link} to="/einstellungen/konto"><Avatar src={this.state.profileImage} className="avatar" style={{ width: 48, height: 48 }} /></IconButton>
                            <CurrentAccountDisplay />
                        </div>
                    </CardContent>
                </Card>
            </div>
          );
    }

}



class CurrentAccountDisplay extends Component {

    constructor() {

        super();

        this.state = {userFirstname: 'Lädt...', userLastname: '', userStufe: ''};

    }

    componentDidMount() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            let data = snapshot.val();
            let userInfo = data[Object.keys(data)[0]]
            this.setState({ userFirstname: userInfo.firstname, userLastname: userInfo.lastname, userStufe: userInfo.stufe, userIsAdmin: userInfo.admin ? true : false });

        }).catch(err => {

            console.log('Error loading user data in CurrentAccountDisplay:', err);

        });

    }

    handleLogout() {

        let confirm = window.confirm('Möchtest du dich abmelden?');

        if (confirm) {

            auth.signOut();

        }

    }

    render() {

        return (

            <Button className="wrapper" onClick={() => {this.handleLogout()}}>
                <div className="text">
                    <p className="name">{this.state.userFirstname + ' ' + this.state.userLastname}{this.state.userIsAdmin ? ' (Admin)' : ''}</p>
                    <p className="stufe">{this.state.userStufe === 'lehrer' ? <span>Lehrer/in des EGM</span> : <span>Schüler/in <b>·</b> Stufe: {this.state.userStufe}</span> }</p>
                </div>
                <div className="icon">
                    <ExpandIcon color="secondary" />
                </div>
            </Button>

        );

    }

}

class MenuDrawerLeft extends Component {
    state = {
        top: false,
        left: false,
        bottom: false,
        right: false,
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    openDrawerLeft = () => {
        this.setState({ left: true });
    }

    closeDrawerLeft = () => {
        this.setState({ left: false });
    }

  render() {



    const sideList = (

        <div className="list">

            <ProfileDisplay />

            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon>
                        <StartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Start" />
                </ListItem>
                <ListItem button component={Link} to="/plan">
                    <ListItemIcon>
                        <PlanIcon />
                    </ListItemIcon>
                    <ListItemText primary="Vertretungsplan" />
                </ListItem>
                <ListItem button component={Link} to="/stundenplan">
                    <ListItemIcon>
                        <StundenplanIcon />
                    </ListItemIcon>
                    <ListItemText primary="Stundenplan" />
                </ListItem>
                <ListItem button component={Link} to="/kalender">
                    <ListItemIcon>
                        <KalenderIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kalender" />
                </ListItem>
                <ListItem button component={Link} to="/stufenbrett">
                    <ListItemIcon>
                        <StufenbrettIcon />
                    </ListItemIcon>
                    <ListItemText primary="Stufenbrett" />
                </ListItem>
                <ListItem button component={Link} to="/sharens">
                    <ListItemIcon>
                        <SharensIcon />
                    </ListItemIcon>
                    <ListItemText primary="Sharens" />
                </ListItem>
                <ListItem button component={Link} to="/mensa">
                    <ListItemIcon>
                        <MensaIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mensa" />
                </ListItem>
                <ListItem button component={Link} to="/archiv/news">
                    <ListItemIcon>
                        <ArchivIcon />
                    </ListItemIcon>
                    <ListItemText primary="Archiv" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <ListItemText primary="Team" />
                </ListItem>
                <ListItem button>
                    <ListItemText primary="Impressum" />
                </ListItem>
            </List>

        </div>

    );

    return (
        <div>
            <IconButton className="menuButton" color="secondary" aria-label="Menu"  onClick={this.toggleDrawer('left', true)}>
                <MenuIcon />
            </IconButton>

            <SwipeableDrawer open={this.state.left} onClose={this.toggleDrawer('left', false)} onOpen={this.toggleDrawer('left', true)}>

                <div tabIndex={0} role="button" onClick={this.toggleDrawer('left', false)} onKeyDown={this.toggleDrawer('left', false)}>

                    {sideList}

                </div>

            </SwipeableDrawer>

        </div>
    );
  }
}

export default EGMAppBar;
