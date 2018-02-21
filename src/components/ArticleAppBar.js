import React, { Component } from 'react';

import './ArticleAppBar.css';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';


const primaryColor = '#01579B';


class ArticleAppBar extends Component {

    componentDidMount() {

    

    }

    render() {

        return (
            <div className="root">
                <AppBar position="fixed" style={{ backgroundColor: primaryColor }}>
                    <Toolbar>
                        <Typography color="inherit" variant="title" className="flex">
                            {this.props.title}
                        </Typography>
                        <IconButton className="closeButton" color="secondary" aria-label="Benachrichtigungen" onClick={() => { this.props.rth === 'true' ? this.props.history.push('/') : this.props.mode === 'stufenbrett' ? this.props.history.push('/stufenbrett') : this.props.history.push('/archiv/' + this.props.mode) }}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        );

    }

}


export default ArticleAppBar;
