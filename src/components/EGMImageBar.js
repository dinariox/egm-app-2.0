import React, { Component } from 'react';

import './EGMImageBar.css';

import EGMAppBar from './EGMAppBar';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

// eslint-disable-next-line
const primaryColor = '#01579B';


class EGMImageBar extends Component {

    render() {

        return (
            <Paper elevation={4}>
                <div className="rootImage">
                    <EGMAppBar title={this.props.title} imageMode={true}></EGMAppBar>
                    <Typography variant="title" className="dateDisplay">
                        {this.props.date}
                    </Typography>
                </div>
            </Paper>
        );

    }

}

export default EGMImageBar;
