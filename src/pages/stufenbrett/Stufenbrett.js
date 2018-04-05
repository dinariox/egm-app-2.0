import React, { Component, Fragment } from 'react';
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
import StufenbrettCard from './../../components/StufenbrettCard';


// Firebase References
import firebase from './../../firebase';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();




class News extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Stufenbrett',
            mode: 'stufenbrett',
            value: 0,
            userIsAdmin: false,
            userStufe: ''
        };

    }


    componentDidMount() {

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            let data = snapshot.val();
            let userInfo = data[Object.keys(data)[0]]
            this.setState({ userStufe: userInfo.stufe, userIsAdmin: userInfo.admin ? true : false });

            console.log(this.state.userStufe, this.state.userIsAdmin);

        }).catch(err => {

            console.log('Error loading user data in OpenArticle:', err);

        });

    }


    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <EGMAppBar ref="appBar" title={this.state.pageTitle} />
                    <div className="appBarSpacer"></div>

                    { this.state.userIsAdmin || this.state.userStufe === 'lehrer' ?


                        <Fragment>

                            <StufenbrettCard stufe="7" heading={this.state.cardHeading} loadColor="#4CAF50" />
                            <StufenbrettCard stufe="8" heading={this.state.cardHeading} loadColor="#4CAF50" />
                            <StufenbrettCard stufe="9" heading={this.state.cardHeading} loadColor="#4CAF50" />
                            <StufenbrettCard stufe="10" heading={this.state.cardHeading} loadColor="#4CAF50" />
                            <StufenbrettCard stufe="11" heading={this.state.cardHeading} loadColor="#4CAF50" />
                            <StufenbrettCard stufe="12" heading={this.state.cardHeading} loadColor="#4CAF50" />

                        </Fragment>

                    :

                        <Fragment>

                            {this.state.userStufe === '7' && <StufenbrettCard stufe="7" heading={this.state.cardHeading} loadColor="#4CAF50" />}
                            {this.state.userStufe === '8' && <StufenbrettCard stufe="8" heading={this.state.cardHeading} loadColor="#4CAF50" />}
                            {this.state.userStufe === '9' && <StufenbrettCard stufe="9" heading={this.state.cardHeading} loadColor="#4CAF50" />}
                            {this.state.userStufe === '10' && <StufenbrettCard stufe="10" heading={this.state.cardHeading} loadColor="#4CAF50" />}
                            {this.state.userStufe === '11' && <StufenbrettCard stufe="11" heading={this.state.cardHeading} loadColor="#4CAF50" />}
                            {this.state.userStufe === '12' && <StufenbrettCard stufe="12" heading={this.state.cardHeading} loadColor="#4CAF50" />}

                        </Fragment>
                    
                    }


                </div>

            </MuiThemeProvider>



        );
    }

}




export default News;
