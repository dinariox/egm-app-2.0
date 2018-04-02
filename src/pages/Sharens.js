import React, { Component } from 'react';
import 'typeface-roboto';

import './../main.css';

import imagebarImage1 from './../img/sharensLogo.jpg';
import sharensImage from './../img/sharensTeam.jpg';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Card, { CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import ArrowIcon from 'material-ui-icons/NavigateNext';


// Own components
import EGMImageBar from './../components/EGMImageBar';
import WelcomeCard from './../components/WelcomeCard';
import ArticlesCard from './../components/ArticlesCard';


// Firebase References
import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();
// const storage = firebase.storage();



class Sharens extends Component {

    constructor() {

        super();
        this.state = {
            pageTitle: 'Sharens'
        };

    }


    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMImageBar title={this.state.pageTitle} images={[imagebarImage1]} />

                    <Card>

                        <CardContent>

                            <Typography variant="headline" paragraph>
                                Was ist sharens.info?
                            </Typography>

                            <Typography paragraph className="paragraphText">
                                Sharens.info ist eine Internetplattform für Jugendliche, auf der man Erfahrungen über sein
                                soziales Engagement (z.B. beim Diakonischen Praktikum oder dem diakonischen Baustein in
                                der Klasse 8) teilen und sich mit anderen darüber austauschen kann. So kann man Kontakte
                                mit anderen Jugendlichen knüpfen und voneinander lernen.
                            </Typography>
                            <Typography className="paragraphText">
                                Des Weiteren gibt es die Möglichkeit sich über Stellen und Institutionen aus dem sozialen
                                Bereich zu informieren und sich gegebenenfalls mit ihnen in Verbindung zu setzen.
                                Außerdem gibt es auf der Seite Rat, falls man Anregungen oder Hilfe für diese Stellen
                                braucht.
                            </Typography>

                        </CardContent>

                        <CardActions>

                            <Button style={{ color: '#4bbd14' }} href="http://sharens.info" target="_blank" size="small">Sharens.info besuchen<ArrowIcon className="arrowIcon" /></Button>

                        </CardActions>

                    </Card>

                    <Card>

                        <CardMedia style={{ height: 230 }} image={sharensImage} />

                        <CardContent>

                            <Typography variant="headline" paragraph>
                                Das Sharens-Team
                            </Typography>

                            <Typography paragraph className="paragraphText">
                                Unser Team besteht momentan aus zwölf Mitarbeitern und drei betreuenden Lehrern.<br />
                                Unsere Aufgabe ist die Instandhaltung und Weiterentwicklung bzw. - verbreitung der
                                Website www.sharens.info .
                            </Typography>
                            <Typography paragraph className="paragraphText">
                                Dazu arbeiten wir in fünf verschieden Abteilungen: Verwaltung, Finanzen,
                                Marketing/Vertrieb, Design und IT-Verwaltung. Die Aufgaben der Verwaltung bestehen
                                hauptsächlich darin den Schriftverkehr zu führen, die Mitgliederanteile zu verwalten sowie
                                kleinere organisatorische Aufgaben zu erledigen. Die Finanzabteilung kümmert sich um die
                                Kontoaufsicht und –führung, aber auch um die allgemeine Buchführung. In der
                                Marketingabteilung werden Verkaufsgespräche über Stellenanzeigen mit Institutionen und
                                anderen Kooperationspartnern geführt. In diesem Zusammenhang werden
                                Informationsvorträge gehalten. Solche Vorträge werden aber auch in der Schule gehalten.
                                Im Design werden Flyer, Plakate und Visitenkarten erstellt. Ein weiterer Aufgabenbereich
                                sind oftmals auch der Layoutentwurf von Präsentationen und Giveaways.<br />
                                Neben all den Abteilungen, die nicht direkt an der Homepage arbeiten, gibt es natürlich noch
                                die IT-Verwaltung. Dort kümmert man sich um die Veröffentlichung von Beiträgen, die
                                Sicherheitsupdates, das Hochladen von Stellenanzeigen und die allgemeine Funktionalität
                                der Website.
                            </Typography>
                            <Typography className="paragraphText">
                                Momentan besteht der Vorstand aus folgenden drei Mitgliedern: Lara Eigner (EF), Erik
                                Benger (Q2) und Mira Weiß (Q2). Betreut werden wir als gesamtes Team von den
                                Lehrkräften Sabine Hegmann, Michael Hofmann und Bastian Händel.
                            </Typography>

                        </CardContent>


                    </Card>

                    <Card>

                        <CardContent>

                            <Typography variant="headline" paragraph>
                                Schau vorbei bei Sharens
                            </Typography>

                            <Typography paragraph className="paragraphText">
                                Als erste Möglichkeit bieten sich die regelmäßigen
                                Dienstagstreffen an, die in der sechsten Stunde beginnen. Die
                                Treffen finden im Sharensraum (Raum 53, über dem
                                Musikraum 58) statt. Des Weiteren könnt ihr zu den
                                Workshops kommen, die bei Bedarf zu bestimmten Themen
                                stattfindend. Die Termine dafür hängen am
                                FUN/Sharensbrett aus - schaut doch einfach mal drauf.
                            </Typography>
                            <Typography className="paragraphText">
                                Wir freuen uns immer über Leute, die mitarbeiten möchten.
                                Bei weiteren Fragen könnt ihr natürlich auch Lara Eigner (EF),
                                Erik Benger (Q2) oder Mira Weiß (Q2) als Vorstand, oder
                                jemand anderen aus dem Team ansprechen.
                            </Typography>

                        </CardContent>

                    </Card>


                </div>


            </MuiThemeProvider>



        );
    }
}




export default Sharens;
