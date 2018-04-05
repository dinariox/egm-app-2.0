import React, { Component } from 'react';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';

import './WelcomeCard.css';

import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();

let intervalWelcome;
let timeoutWelcome;

class WelcomeCard extends Component {

    constructor(props) {

        super(props);

        this.state = {

            userfirstname: this.props.userfirstname,
            welcomeMessages: [],
            animation: '',
            loadingCircle: '',
            font: 'Indie Flower',
            timeoutWelcome: null,
            intervalWelcome: null

        };

    }

    componentDidMount() {

        db.ref('users').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then(snapshot => {

            let data = snapshot.val();
            var userInfo = data[Object.keys(data)[0]]


            db.ref('willkommenstexte').once('value', snapshot => {

                let messages = snapshot.val();
                let sortedMessages = [];

                // Texte werden in neues Array sortiert, da die Firebase bei 1 anfängt, nicht 0
                messages.forEach(element => {

                    sortedMessages.push(element);

                });

                let amountOfMessages = sortedMessages.length;

                let randomNumber = Math.floor(Math.random() * amountOfMessages);
                let randomMessage = sortedMessages[randomNumber];

                let messageText = randomMessage.text;
                let replacedMessage = messageText.replace('[NAME]', userInfo.firstname);

                this.setState({
                    message: replacedMessage,
                    author: randomMessage.autor,
                    language: randomMessage.sprache,
                    animation: 'fade-in 0.5s forwards',
                    loadingCircle: 'fade-out 0.2s forwards',
                    font: randomMessage.sprache === 'Russisch' ? 'Neucha' : 'Indie Flower'
                });



                this.setState({ timeoutWelcome: setTimeout(() => {

                    this.setState({
                        animation: 'fade-out 0.5s forwards'
                    });

                }, 9500)});

                this.setState({ intervalWelcome: setInterval(() => {

                    setTimeout(() => {

                        this.setState({
                            animation: 'fade-out 0.5s forwards'
                        });

                    }, 9500);

                    let randomNumber = Math.floor(Math.random() * amountOfMessages);
                    let randomMessage = sortedMessages[randomNumber];

                    let messageText = randomMessage.text;
                    let replacedMessage = messageText.replace('[NAME]', userInfo.firstname);

                    this.setState({
                        message: replacedMessage,
                        author: randomMessage.autor,
                        language: randomMessage.sprache,
                        animation: 'fade-in 0.5s forwards',
                        font: randomMessage.sprache === 'Russisch' ? 'Neucha' : 'Indie Flower'
                    });

                }, 10000)});




            },
                (error) => {

                    console.error(error);

                });

        })

        

        

    }

    componentWillUnmount () {

        clearInterval(this.state.intervalWelcome);
        clearTimeout(this.state.timeoutWelcome);

    }


    render() {

        return (

            <Card className="welcomeCard">

                <CardContent style={{paddingBottom: '16px'}}>
                    
                    <CircularProgress className="welcomeLoadingCircle" style={{ animation: this.state.loadingCircle }} />
                    <Typography variant="title" className="welcomeMessage" style={{ animation: this.state.animation, fontFamily: this.state.font }}>{this.state.message}</Typography>
                    <Typography variant="caption" className="welcomeInfo" style={{ animation: this.state.animation }}>{this.state.author} - {this.state.language}</Typography>

                </CardContent>

            </Card>

        );

    }

}

export default WelcomeCard;