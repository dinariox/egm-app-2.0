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


// Swipeable
import Swipeable from 'react-swipeable';


// Own Components
import EGMAppBar from './../components/EGMAppBar';
import VertretungExpansionPanel from './../components/VertretungExpansionPanel';


// Firebase References
import firebase from './../firebase';
import { relative } from 'path';

// const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();




class Mensa extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Mensa',
            modeValue: 0,
            mensaplanURL: ''
        };

    }


    componentDidMount() {

        storage.ref('mensaplan/Speiseplan.png').getDownloadURL().then((url) => {

            this.setState({ mensaplanURL: url });

        });

    }

    swipedRight(e, deltaX, isFlick) {

        if (deltaX <= -50 && isFlick) {

            this.refs.appBar.refs.menuDrawerLeft.openDrawerLeft();

        }

    }

    swipedLeft(e, deltaX, isFlick) {

        if (deltaX >= 50 && isFlick) {

            this.refs.appBar.refs.menuDrawerLeft.closeDrawerLeft();

        }

    }

    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <Swipeable
                    onSwipedRight={(e, deltaX, isFlick) => this.swipedRight(e, deltaX, isFlick)}
                    onSwipedLeft={(e, deltaX, isFlick) => this.swipedLeft(e, deltaX, isFlick)}>

                    <CssBaseline />

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />

                    <div className="appBarSpacer"></div>

                    { this.state.modeValue === 0 ?

                        <div>

                            <Typography variant="title" style={{ padding: 16 }}>Alles rund um unsere Schulmensa</Typography>

                            <Typography paragraph style={{ paddingLeft: 16, paddingRight: 16, lineHeight: 1.5 }}>
                                In unserer Schulmensa findest du jede Mittagspause ein gesundes und abwechslungsreiches Mittagessen. Seit 2010 ist sie mit ihren vielen verschiedenen Verwendungszwecken und ihrer modernen Ausstattung eines der Herzstücke unserer Schule geworden.<br />
                                In diesem Menü kannst du dir das Essens-Angebot der nächsten oder aktuellen Woche ansehen oder mit einem Klick dein Mensa-Konto bzw. Abo verwalten. Guten Appetit!
                            </Typography>

                            <Typography variant="caption" paragraph style={{ paddingLeft: 16, paddingRight: 16 }}>
                                Beachte bitte die Mensanummer unserer Schule: <b>597 1344</b>
                            </Typography>

                            <Button variant="raised" href="https://wegener2.securerwsoft.de/clickmeniw/clickmen.dll/" target="_blank" style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)', marginBottom: 32, backgroundColor: '#4CAF50', color: 'white' }}>Mensa-Konto</Button>

                            <Typography variant="title" style={{ padding: 16 }}>Der Mensa-Verein</Typography>

                            <Typography paragraph style={{ paddingLeft: 16, paddingRight: 16, lineHeight: 1.5 }}>
                                Der Mensa-Verein ist zuständig für die komplette Organisation der Mensa.
                            </Typography>

                            <Button variant="raised" color="primary" href="http://ev-g-m.de/mensa-verein.html" target="_blank" style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>Weitere Informationen</Button>

                        </div>

                        :

                        <div>

                            <Typography variant="title" style={{ padding: 16 }}>Der aktuelle Mensa-Plan</Typography>

                            <img src={this.state.mensaplanURL} style={{ width: '100%', padding: 16 }} />

                        </div>

                    }
                

                    <div className="bottomNavigationSpacer"></div>

                    <Paper elevation={7} style={{ position: 'fixed', width: '100%', bottom: 0}}>
                        <BottomNavigation value={this.state.modeValue} showLabels>
                            <BottomNavigationAction label="Informationen" icon={<CDayIcon />} onClick={() => { this.setState({ modeValue: 0 }) }} />
                            <BottomNavigationAction label="Mensaplan" icon={<NDayIcon />} onClick={() => { this.setState({ modeValue: 1 }) }} />
                        </BottomNavigation>
                    </Paper>

                </Swipeable>
                    

            </MuiThemeProvider>



        );
    }

}




export default Mensa;
