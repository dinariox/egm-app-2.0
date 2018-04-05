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
import Card, { CardContent, CardActions } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Grow from 'material-ui/transitions/Grow';
import Grid from 'material-ui/Grid';
import Zoom from 'material-ui/transitions/Zoom';

import CDayIcon from 'material-ui-icons/Today';
import NDayIcon from 'material-ui-icons/Event';

import CheckIcon from 'material-ui-icons/Check';


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
            mensaplanURL: '',
            mensaplanLoaded: false
        };

    }


    componentDidMount() {

        storage.ref('mensaplan/Speiseplan.png').getDownloadURL().then((url) => {

            this.setState({ mensaplanURL: url });

        });

    }


    render() {

        let paddingGrid;

        if (document.documentElement.clientWidth > 960) {
            paddingGrid = { padding: 16 };
        }
        else {
            paddingGrid = {};
        }

        return (


            <MuiThemeProvider theme={theme}>

                <div>

                    <CssBaseline />

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />

                    <div className="appBarSpacer"></div>

                    { this.state.modeValue === 0 ?

                        <Grid container spacing={16} style={paddingGrid}>

                            <Grid item xs={12} md={6}>

                                <Card style={{ width: '100%' }}>
                                    <CardContent style={{ paddingLeft: 24, paddingRight: 24 }}>
                                        <Typography gutterBottom variant="headline" component="h2">
                                            Alles rund um unsere Schulmensa
                                        </Typography>
                                        <Typography component="p">
                                            In unserer Schulmensa findest du jede Mittagspause ein gesundes und abwechslungsreiches Mittagessen. Seit 2010 ist sie mit ihren vielen verschiedenen Verwendungszwecken und ihrer modernen Ausstattung eines der Herzstücke unserer Schule geworden.<br />
                                            In diesem Menü kannst du dir das Essens-Angebot der nächsten oder aktuellen Woche ansehen oder mit einem Klick dein Mensa-Konto bzw. Abo verwalten. Guten Appetit!
                                        </Typography>
                                        <Typography variant="caption" style={{ color: '#777', marginTop: 8 }}>
                                            Beachte bitte die Mensanummer unserer Schule: <b>597 1344</b>
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{ paddingLeft: 12, paddingRight: 12 }}>
                                        <Button size="small" color="primary" href="https://wegener2.securerwsoft.de/clickmeniw/clickmen.dll/" target="_blank">Mensa-Konto</Button>
                                    </CardActions>
                                </Card>

                            </Grid>

                            <Grid item xs={12} md={6}>

                                <Card style={{ width: '100%' }}>
                                    <CardContent style={{ paddingLeft: 24, paddingRight: 24 }}>
                                        <Typography gutterBottom variant="headline" component="h2">
                                            Der Mensa-Verein
                                        </Typography>
                                        <Typography component="p">
                                            Der Mensa-Verein ist zuständig für die komplette Organisation der Mensa.    
                                        </Typography>
                                    </CardContent>
                                    <CardActions style={{ paddingLeft: 12, paddingRight: 12 }}>
                                        <Button size="small" color="primary" href="http://ev-g-m.de/mensa-verein.html" target="_blank">Weitere Informationen</Button>
                                    </CardActions>
                                </Card>

                            </Grid>

                        </Grid>

                        :

                        <div>

                            <Card style={{ width: '100%' }}>
                                <CardContent style={{ paddingLeft: 24, paddingRight: 24 }}>
                                    <Typography gutterBottom variant="headline" component="h2">
                                        Der aktuelle Mensa-Plan
                                    </Typography>
                                    <Typography component="p">
                                        Hier kannst du den aktuellen Mensaplan einsehen
                                    </Typography>
                                    <Button href={this.state.mensaplanURL} target="_blank"><img onLoad={() => this.setState({ mensaplanLoaded: true })} src={this.state.mensaplanURL} style={{ width: '100%', padding: 16 }} /></Button>
                                    <CircularProgress style={{ display: this.state.mensaplanLoaded ? 'none' : '', position: 'relative', left: '50%', transform: 'translateX(-50%)' }} />
                                </CardContent>
                            </Card>           

                        </div>

                    }
                

                    <div className="bottomNavigationSpacer"></div>

                    <Paper elevation={7} style={{ position: 'fixed', width: '100%', bottom: 0}}>
                        <BottomNavigation value={this.state.modeValue} showLabels>
                            <BottomNavigationAction label="Informationen" icon={<CDayIcon />} onClick={() => { this.setState({ modeValue: 0 }) }} />
                            <BottomNavigationAction label="Mensaplan" icon={<NDayIcon />} onClick={() => { this.setState({ modeValue: 1 }) }} />
                        </BottomNavigation>
                    </Paper>

                </div>
                    

            </MuiThemeProvider>



        );
    }

}




export default Mensa;
