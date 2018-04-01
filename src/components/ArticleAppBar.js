import React, { Component } from 'react';

import './ArticleAppBar.css';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';

import EditIcon from 'material-ui-icons/Edit';
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
                            {this.props.editMode ? this.props.title + ' bearbeiten' : this.props.title}
                        </Typography>
                        {
                            this.props.editIcon &&
                            <IconButton className="closeButton" color="secondary" aria-label="Artikel bearbeiten" onClick={() => this.props.enterEditMode() }>
                                <EditIcon />
                            </IconButton>
                        }
                        <IconButton className="closeButton" color="secondary" aria-label="Benachrichtigungen" onClick={() => { this.props.editMode ? this.props.cancleEdit() : this.props.rth === 'true' ? this.props.history.push('/') : this.props.mode === 'stufenbrett' ? this.props.history.push('/stufenbrett') : this.props.history.push('/archiv/' + this.props.mode) }}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        );

    }

}


export default ArticleAppBar;
