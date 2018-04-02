import React, { Component } from 'react';

import './EGMImageBar.css';

import EGMAppBar from './EGMAppBar';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';


// eslint-disable-next-line
const primaryColor = '#01579B';


class EGMImageBar extends Component {

    constructor(props) {

        super(props);

        this.state = {
            style: {

                rootImage: {
                    height: '230px',
                    backgroundImage: 'url(' + this.props.images[0] + ')',
                    backgroundSize: 'cover'
                }

            }
        }

    }

    render() {

        return (
            <Paper elevation={4}>
                <div style={this.state.style.rootImage}>
                    <EGMAppBar ref="appBar" title={this.props.title} imageMode={true}></EGMAppBar>
                    {
                        this.props.date &&

                        <Typography variant="title" className="dateDisplay">
                            {this.props.date}
                        </Typography>
                    }
                </div>
            </Paper>
        );

    }

}

export default EGMImageBar;
