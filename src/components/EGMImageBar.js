import React, { Component } from 'react';

import './EGMImageBar.css';

import EGMAppBar from './EGMAppBar';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import bgImage from './../img/schoolRendering.jpg';
import sharensImage from './../img/sharensLogo.jpg';

// eslint-disable-next-line
const primaryColor = '#01579B';


class EGMImageBar extends Component {

    constructor(props) {

        super(props);

        const titleImage = this.props.sharens ? sharensImage : bgImage;

        this.state = {
            style: {

                rootImage: {
                    height: '230px',
                    backgroundImage: 'url(' + titleImage + ')',
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
                    { !this.props.sharens ?

                        <Typography variant="title" className="dateDisplay">
                            {this.props.date}
                        </Typography>

                        :

                        null

                    }
                </div>
            </Paper>
        );

    }

}

export default EGMImageBar;
