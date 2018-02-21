import React, { Component } from 'react';

import './ArchivNavigation.css';

import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import AktuellesIcon from 'material-ui-icons/Whatshot';
import SVIcon from 'material-ui-icons/Portrait';
import SchulleitungIcon from 'material-ui-icons/SpeakerNotes';

class ArchivNavigation extends Component {

    render() {

        return (

            <Paper elevation={5} className="bottomNavigation">
                <BottomNavigation value={this.props.value} showLabels>
                    <BottomNavigationAction label="Aktuelles" icon={<AktuellesIcon />} onClick={() => { this.props.history.push('/archiv/news') }} />
                    <BottomNavigationAction label="SV" icon={<SVIcon />} onClick={() => { this.props.history.push('/archiv/sv') }} />
                    <BottomNavigationAction label="Schulleitung" icon={<SchulleitungIcon />} onClick={() => { this.props.history.push('/archiv/schulleitung') }} />
                </BottomNavigation>
            </Paper>

        );

    }

}

export default ArchivNavigation;