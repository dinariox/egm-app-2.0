import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components


// Swipeable
import Swipeable from 'react-swipeable';

// Own components
import EGMImageBar from './../components/EGMImageBar';
import WelcomeCard from './../components/WelcomeCard';
import ArticlesCard from './../components/ArticlesCard';

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


    componentWillMount() {

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


    componentDidMount() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            snapshot.forEach(val => { return val.val() });

        })

    }

    swipedRight(e, deltaX, isFlick) {
        
        if (deltaX <= -50 && isFlick) {

            this.refs.appBar.refs.appBar.refs.menuDrawerLeft.openDrawerLeft();

        }

    }

    swipedLeft(e, deltaX, isFlick) {

        if (deltaX >= 50 && isFlick) {

            this.refs.appBar.refs.appBar.refs.menuDrawerLeft.closeDrawerLeft();

        }

    }



    render() {
        return (

            <MuiThemeProvider theme={theme}>

            <Swipeable
                onSwipedRight={(e, deltaX, isFlick) => this.swipedRight(e, deltaX, isFlick)}
                onSwipedLeft={(e, deltaX, isFlick) => this.swipedLeft(e, deltaX, isFlick)}
                style={{ backgroundColor: '#fbfbfb', minHeight: '100vh'}}>

                <CssBaseline />

                <EGMImageBar ref="appBar" title={this.state.pageTitle} date={this.state.currentDate} />
                
                <WelcomeCard />
    
                <div className="articleCardsWrapper">
                
                    <ArticlesCard className="articleCardsChild" heading="Aktuelles" mode="news" rth={true} loadColor="#4CAF50" history={this.props.history} />

                    <ArticlesCard className="articleCardsChild" heading="Neuigkeiten der SV" mode="sv" rth={true} loadColor="#FFB300" history={this.props.history} />

                    <ArticlesCard className="articleCardsChild" heading="Mitteilungen der Schulleitung" mode="schulleitung" rth={true} loadColor="#EF5350" history={this.props.history} />

                </div>

            </Swipeable>


            </MuiThemeProvider>



        );
    }
}




export default Home;
