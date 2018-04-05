import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

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

const sideList =  (

    <Fragment>

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
            <ListItem button component={Link} to="/impressum">
                <ListItemText primary="Impressum" />
            </ListItem>
        </List>

    </Fragment>

);


export default sideList;