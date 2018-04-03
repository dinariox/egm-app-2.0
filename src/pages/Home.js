import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

import imagebarImage1 from './../img/schoolRendering.jpg';
import imagebarImage2 from './../img/sharensLogo.jpg';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components


// Own components
import EGMImageBar from './../components/EGMImageBar';
import WelcomeCard from './../components/WelcomeCard';
import ArticlesCard from './../components/ArticlesCard';
import ShortcutsCard from './../components/ShortcutsCard';

// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();



class Home extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Start',
            currentDate: ''
        };

    }


    componentDidMount() {

        let cDay = new Date().getDate();
        let cMonth = new Date().getMonth();
        let cYear = new Date().getFullYear();

        let monthNames = [
            'Januar',
            'Februar',
            'März',
            'April',
            'Mai',
            'Juni',
            'Juli',
            'August',
            'September',
            'Oktober',
            'November',
            'Dezember'
        ]

        let cMonthName = monthNames[cMonth];

        let cDate = cDay + '. ' + cMonthName + ' ' + cYear;

        this.setState({
            currentDate: cDate
        });



        

    }



    render() {
        return (

            <MuiThemeProvider theme={theme}>

            <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh'}}>

                <CssBaseline />

                <EGMImageBar title={this.state.pageTitle} date={this.state.currentDate} images={[imagebarImage1, imagebarImage2]} />
                
                <WelcomeCard />

                <ShortcutsCard />
    
                <div className="articleCardsWrapper">
                
                    <ArticlesCard className="articleCardsChild" heading="Aktuelles" mode="news" rth={true} loadColor="#4CAF50" history={this.props.history} />

                    <ArticlesCard className="articleCardsChild" heading="Neuigkeiten der SV" mode="sv" rth={true} loadColor="#FFB300" history={this.props.history} />

                    <ArticlesCard className="articleCardsChild" heading="Mitteilungen der Schulleitung" mode="schulleitung" rth={true} loadColor="#EF5350" history={this.props.history} />

                </div>

            </div>


            </MuiThemeProvider>



        );
    }
}




export default Home;
