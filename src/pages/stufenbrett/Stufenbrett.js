import React, { Component } from 'react';
import 'typeface-roboto';

import './../../main.css';

// MUI
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../../theme';

// MUI Colors


// MUI Components


// Swipeable
import Swipeable from 'react-swipeable';

// Own Components
import EGMAppBar from './../../components/EGMAppBar';
import FullArticlesCard from './../../components/FullArticlesCard';
import ArchivNavigation from './../../components/ArchivNavigation';
import StufenbrettCard from './../../components/StufenbrettCard';


// Firebase References
// import firebase from './../firebase';
// const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();




class News extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Stufenbrett',
            cardHeading: 'Das digitale Stufenbrett der Stufe 11',
            mode: 'stufenbrett',
            value: 0
        };

    }

    swipedRight(e, deltaX, isFlick) {

        if (deltaX <= -50 && isFlick) {

            this.refs.appBar.refs.menuDrawerLeft.openDrawerLeft();

        }

    }

    swipedLeft(e, deltaX, isFlick) {

        if (deltaX >= 50 && isFlick) {

            this.refs.appBar.refs.menuDrawerLeft.closeDrawerLeft();

        }

    }

    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <Swipeable
                    onSwipedRight={(e, deltaX, isFlick) => this.swipedRight(e, deltaX, isFlick)}
                    onSwipedLeft={(e, deltaX, isFlick) => this.swipedLeft(e, deltaX, isFlick)}
                    style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />
                    <div className="appBarSpacer"></div>

                    <StufenbrettCard heading={this.state.cardHeading} loadColor="#4CAF50" />

                </Swipeable>

            </MuiThemeProvider>



        );
    }

}




export default News;
