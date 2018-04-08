import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Typography from 'material-ui/Typography';
import ListSubheader from 'material-ui/List/ListSubheader';
import List, { ListItem, ListItemText, ListItemSecondaryAction, ListItemIcon} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import Slide from 'material-ui/transitions/Slide';

import MenuIcon from 'material-ui-icons/MoreVert';
import NotificationsIcon from 'material-ui-icons/Notifications';
import StarIcon from 'material-ui-icons/Star';


// Own components
import EGMAppBar from './../components/EGMAppBar';


// Firebase References
import firebase from './../firebase';
const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();


class Home extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Kalender',
            calenderEvents: [

                {
                    month: 'Januar 2018',
                    events: [
                        {
                            date: '22',
                            title: 'App-Planung 2.0',
                            info: 'Erste Entwürfe und ein Früher Entwicklungsstand der EGM-App 2.0 wird Schulleiter Sven Dombrowski präsentiert.'
                        },
                        {
                            date: '29',
                            title: 'Zeugniskonferenzen',
                            info: 'Für die Schülerinnen und Schüler fällt nach der vierten Stunde der Unterricht, aufgrund der Zeugniskonferenzen, aus.'
                        },
                        {
                            date: '30',
                            title: 'Zeugniskonferenzen',
                            info: 'Für die Schülerinnen und Schüler fällt nach der vierten Stunde der Unterricht, aufgrund der Zeugniskonferenzen, aus.'
                        }
                    ]
                },
                {
                    month: 'Februar 2018',
                    events: [
                        {
                            date: '2',
                            title: 'Zeugnisausgabe',
                            info: 'Mit der Zeugnisausgabe endet das Schulhalbjahr 2017/18.'
                        },
                        {
                            date: '2',
                            title: 'Festgottesdienst Verabschiedung Herr Kessler',
                            info: 'Die Schule verabschiedet und würdigt mit einem Festgottesdienst ihren langjährigen stellv. Direktor Herrn Kessler in den Ruhestand. Als nachfolge wird Frau Haarbach feierlich begrüßt.'
                        },
                        {
                            date: '3',
                            title: 'Anmeldung für Neuzugänge',
                            info: 'Anmeldungen für die neuen Stufen 5 und für die Oberstufe (10:00-12:00 Uhr).'
                        },
                        {
                            date: '9',
                            title: 'Beweglicher Ferientag',
                            info: 'Am 9. Februar fällt der Unterricht für die Schülerinnen und Schüler aus. Die Schule wünscht viel Spaß beim Karneval feiern!'
                        },
                        {
                            date: '12',
                            title: 'Rosenmontag',
                            info: 'Die Schule wünscht den Schülerinnen und Schülern, sowie den Kolleginnen und Kollegen einen schönen Rosenmontag 2018!'
                        },
                        {
                            date: '14',
                            title: 'Schulgottesdienst',
                            info: 'Die Schule laden zum gemeinsamen Gottesdienst in der Jesus-Christus-Kirche ein!'
                        }
                    ]
                },
                {
                    month: 'März 2018',
                    events: [
                        {
                            date: '1',
                            title: 'Lernstandserhebung Stufe 8 Englisch',
                            info: 'Die Stufe 8. schreibt am Donnerstag, den 1. März die Lernstandserhebungen im Fach Englisch.'
                        },
                        {
                            date: '2',
                            title: 'Probenwochenende Theater',
                            info: 'Theater-AG startet ihr jährliches Probenwochenende.'
                        }
                    ]
                }
            ],
            anchorEl: null
        };

    }


    componentDidMount() {

        

    }


    handleClick = event => {

        this.setState({ anchorEl: event.currentTarget });

    }


    handleClose = () => {

        this.setState({ anchorEl: null });

    }


    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div>

                    <CssBaseline />

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />

                    <div className="appBarSpacer"></div>

                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)', textAlign: 'center', width: 300 }}>
                        <Typography variant="display2" paragraph style={{ fontWeight: 300 }}>In Arbeit</Typography>
                        <Typography variant="headline" style={{ fontWeight: 300 }}>Der Kalender braucht noch etwas Arbeit und steht bald zu Verfügung</Typography>
                    </div>

                    {/* {this.state.calenderEvents.map((monthObj, index1) => (
                        <div key={`section-${index1}`} className="calenderListItem">

                            <Typography variant="subheading" style={{ textAlign: 'center', marginTop: 12 }}>{monthObj.month}</Typography>

                            {monthObj.events.map((event, index2) => (
                                <Paper elevation={4} style={{ margin: 8, padding: 16, position: 'relative', backgroundColor: index2 % 2 === 0 ? '#64B5F6' : '#E57373' }} key={`item-${index1}-${index2}`}>
                                    
                                    <Typography variant="subheading" style={{ fontSize: '14pt' }}><b style={{ fontSize: '16pt' }}>{event.date}.</b>&nbsp;{event.title}</Typography>
                                    <Typography>{event.info}</Typography>

                                    <IconButton aria-label="Delete" style={{ position: 'absolute', top: 4, right: 0 }}>
                                        <MenuIcon
                                            aria-owns={this.state.anchorEl ? 'simple-menu' : null}
                                            aria-haspopup="true"
                                            onClick={this.handleClick}
                                        />
                                    </IconButton>
                                    
                                </Paper>
                            ))}
                        </div>
                    ))}

                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClose}>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText style={{marginLeft: -16}} inset primary="3 Tage vorher erinnern" />
                        </MenuItem>
                        <MenuItem onClick={this.handleClose}>
                            <ListItemIcon>
                                <StarIcon />
                            </ListItemIcon>
                            <ListItemText style={{ marginLeft: -16 }} inset primary="Markieren" />
                        </MenuItem>
                    </Menu> */}

                </div>

            </MuiThemeProvider>



        );
    }
}




export default Home;
