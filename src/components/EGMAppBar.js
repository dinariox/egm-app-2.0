import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './EGMAppBar.css';

import Drawer from 'material-ui/Drawer';
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
// import NotificationsActiveIcon from 'material-ui-icons/NotificationsActive';

import personImg from './../img/person.jpg';
import cardImage from './../img/polyMenuBackground.jpg';

// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();


const primaryColor = '#01579B';

const scrollDistanceUntilSolidAppbar = 164; // px




class EGMAppBar extends Component {

    constructor(props) {

        super(props);

        if (this.props.imageMode) {

            this.state = { background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.15) 15%,rgba(0,0,0,0) 100%)', shadow: 'none', transition: 'background 200ms, box-shadow 200ms', transparent: true};

            this.checkScroll = this.checkScroll.bind(this);

        } else {

            this.state = {background: primaryColor, shadow: ''};

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

    }

    componentWillUnmount(){

        if (this.props.imageMode) {
            window.removeEventListener('scroll', this.checkScroll);
        }

    }

    render() {

        return (
            <div className="root">
                <AppBar position="fixed" style={{background: this.state.background, boxShadow: this.state.shadow, transition: this.state.transition}}>
                    <Toolbar>
                        <MenuDrawerLeft />
                        <Typography variant="title" color="inherit" className="flex" style={this.state.transparent ? { opacity: 0, transition: 'opacity 200ms' } : { opacity: 1, transition: 'opacity 200ms'} }>
                            {this.state.transparent ? '' : this.props.title}
                        </Typography>
                        <IconButton className="notificationButton" color="secondary" aria-label="Benachrichtigungen">
                            <NotificationsIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
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

    render() {

        return (
            <div>
                <Card style={{
                    minWidth: '275px',
                    backgroundImage: 'url(' + cardImage + ')',
                    backgroundSize: 'cover',
                    backgroundColor: '#abc'}}>
                    <CardContent>
                        <div style={{display: 'flex', width: '100%'}}>
                            <Typography variant="title" style={{color: '#fff'}}>EGM App</Typography>
                            <div className="iconButtonsWrapper">
                                <IconButton color="secondary"><SettingsIcon /></IconButton>
                                <IconButton color="secondary"><HelpIcon /></IconButton>
                            </div>
                        </div>
                        <div className="userInfoWrapper">
                            <Avatar src={personImg} className="avatar" style={{width: 48, height: 48}} />
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

        this.state = {userInfo: {firstname: '', lastname: ''}};

    }

    componentWillMount() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            snapshot.forEach(val => { return this.setState({ userInfo: val.val() })});

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
                    <p className="name">{this.state.userInfo.firstname + ' ' + this.state.userInfo.lastname}</p>
                    <p className="stufe">Schüler/in <b>·</b> Stufe 11</p>
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
                <ListItem button>
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
                <ListItem button>
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

            <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>

                <div tabIndex={0} role="button" onClick={this.toggleDrawer('left', false)} onKeyDown={this.toggleDrawer('left', false)}>

                    {sideList}

                </div>

            </Drawer>

        </div>
    );
  }
}

export default EGMAppBar;
