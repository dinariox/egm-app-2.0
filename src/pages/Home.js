import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

// MUI
import Reboot from 'material-ui/Reboot';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components


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
            currentDate: '',
            user: {
                firstname: 'Timo',
                lastname: 'Nowak',
                stufe: 11
            }
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



    render() {
        return (

            <MuiThemeProvider theme={theme}>

            <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh'}}>

                <Reboot />

                <EGMImageBar title={this.state.pageTitle} date={this.state.currentDate} />
                
                <WelcomeCard userfirstname={this.state.user.firstname} />
    
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
