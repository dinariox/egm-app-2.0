import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid';

import SettingsIcon from 'material-ui-icons/Settings';
import PlanIcon from 'material-ui-icons/List';
import StundenplanIcon from 'material-ui-icons/DateRange';

import './ShortcutsCard.css';

import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();

class ShortcutsCard extends Component {

    constructor(props) {

        super(props);

        this.state = {

        };

    }


    render() {

        return (

            <Card className="shortcutCard">

                <CardContent style={{ padding: 8, paddingBottom: 12 }}>

                    <Grid container>
                    
                        <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to="/plan"><PlanIcon /></IconButton><Typography>Vertretungsplan</Typography></Grid>
                        <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to="/stundenplan"><StundenplanIcon /></IconButton><Typography>Stundenplan</Typography></Grid>
                        <Grid item xs={4} className="shortcutGridItem"><IconButton component={Link} to="/einstellungen"><SettingsIcon /></IconButton><Typography>Einstellungen</Typography></Grid>

                    </Grid>

                </CardContent>

            </Card>

        );

    }

}

export default ShortcutsCard;