import React, { Component } from 'react';

import Card, { CardContent } from 'material-ui/Card';
import ExpansionPanel, { ExpansionPanelSummary, ExpansionPanelDetails } from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import ExpandMoreIcon from 'material-ui-icons/ExpandMore';


import './VertretungExpansionPanel.css';

// import firebase from './../firebase';
// const db = firebase.database();

class VertretungExpansionPanel extends Component {

    constructor(props) {

        super(props);

    }


    render() {

        return (

            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography><b>{this.props.stunde}.</b> Stunde: <b>{this.props.fach} &bull; {this.props.klasse}</b> bei {this.props.fehltname} ({this.props.fehltkuerzel})</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    
                    <div>
                        <Typography>
                            <b>Bemerkung</b><br />{this.props.bemerkung || 'N/A'}
                        </Typography>
                        <br />
                        <Typography>
                            <b>Vertretung</b><br />{this.props.vertrittname || 'N/A'} {this.props.vertrittkuerzel === '' ? '' : '(' + this.props.vertrittkuerzel + ')'}
                        </Typography>
                        <br />
                        <Typography>
                            <b>Raum</b><br />{this.props.raum || 'N/A'}
                        </Typography>
                    </div>

                </ExpansionPanelDetails>
            </ExpansionPanel>

        );

    }

}



export default VertretungExpansionPanel;