import React, { Component } from 'react';

import './EGMImageBar.css';

import EGMAppBar from './EGMAppBar';

import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';


// eslint-disable-next-line
const primaryColor = '#01579B';

let interval;

class EGMImageBar extends Component {

    constructor(props) {

        super(props);

        this.state = {
            backgroundImage: 'url(' + this.props.images[0] + ')',
            interval: null
        }

    }

    componentDidMount() {

        if (this.props.images.length > 1) {

            var i = 1;

            this.setState({ interval: setInterval(() => {

                this.setState({ backgroundImage: 'url(' + this.props.images[i] + ')' });

                if (i + 1 >= this.props.images.length) {
                    i = 0;
                } else {
                    i++;
                }

            }, 10000) });

        }

    }

    
    componentWillUnmount() {

        clearInterval(this.state.interval);

    }


    render() {

        return (
            <Paper elevation={4}>
                <div style={{ height: 230, backgroundSize: 'cover', backgroundImage: this.state.backgroundImage, transition: 'background-image 0.5s ease-in-out' }}>
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
