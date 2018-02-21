import React, { Component } from 'react';
import 'typeface-roboto';

import './../../main.css';

// MUI
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../../theme';

// MUI Colors


// MUI Components


// Own Components
import EGMAppBar from './../../components/EGMAppBar';
import FullArticlesCard from './../../components/FullArticlesCard';
import ArchivNavigation from './../../components/ArchivNavigation';


// Firebase References
// import firebase from './../firebase';
// const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();





class Schulleitung extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Archiv',
            cardHeading: 'Mitteilungen der Schulleitung',
            mode: 'schulleitung',
            value: 2
        };

    }

    render() {

        return (


            <MuiThemeProvider theme={theme}>

            <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                <EGMAppBar title={this.state.pageTitle} />
                <div className="appBarSpacer"></div>

                    <FullArticlesCard heading={this.state.cardHeading} mode={this.state.mode} loadColor="#EF5350" />

                <div className="bottomNavigationSpacer"></div>
                    <ArchivNavigation value={this.state.value} history={this.props.history} />

                </div>

            </MuiThemeProvider>



        );
    }

}




export default Schulleitung;
