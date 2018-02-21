import React, { Component } from 'react';
import 'typeface-roboto';

import './../../main.css';
import './OpenStufenbrett.css';

// MUI
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../../theme';

// MUI Colors


// MUI Components
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';

import MoreImagesIcon from 'material-ui-icons/Collections';
import FileDownloadIcon from 'material-ui-icons/FileDownload';


// Own Components
import ArticleAppBar from './../../components/ArticleAppBar';


// Firebase References
import firebase from './../../firebase';
const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();

let imageH = 0;


class OpenStufenbrett extends Component {

    constructor(props) {

        super(props);

        this.state = {
            pageTitle: 'Stufenbrett-Eintrag',
            article: {
                id: 0,
                title: '',
                text: '',
                date: '',
                icon: '',
                iconColor: '',
                image: ''
            },
            loadingBarOpacity: 1,
            fabOpacity: 0,
            textOpacity: 0
        };

    }

    componentDidMount() {

        const articleID = parseInt(this.props.match.params.articleID);

        db.ref('stufenbrett/11').orderByChild('link').equalTo(articleID).once('value', snapshot => {

            if (!snapshot.exists()) {

                imageH = '0px';
                this.setState({

                    loadingBarOpacity: 0,
                    article: {
                        date: 'Fehler',
                        title: 'Der Artikel exisitert nicht',
                        text: 'Sorry, aber der Artikel, den du versucht hast zu laden, existiert nicht in der Datenbank 😕'
                    }

                });

                return console.error('Artikel mit der ID ' + articleID + ' in Datenbank stufenbrett existiert nicht.');

            }

            const article = snapshot.val()[articleID];

            this.setState({

                article: {
                    id: articleID,
                    title: article.titel || 'Fehler',
                    text: article.text.replace(/<br\s*\/?>/mg, "\n") || 'Fehler',
                    date: article.datum || 'Fehler',
                    icon: article.icon || '',
                    iconColor: article.iconColor || '',
                    image: article.image || '',
                    attachment: article.anhang || undefined
                }

            });

            if (article.image !== "" && article.image !== undefined) {

                let aspectRatio = 16 / 9;
                imageH = window.innerWidth / aspectRatio;
                imageH = imageH >= 500 ? 500 : imageH;

            } else {

                imageH = '0px';
                this.setState({

                    loadingBarOpacity: 0

                });

            }

            this.setState({

                textOpacity: 1

            });

        }).catch(error => {

            this.setState({
                loadingBarOpacity: 0,
            });

            console.error('Article loading error', error.message);

        });


    }


    componentWillUnmount() {

        imageH = 0;

    }


    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <ArticleAppBar title={this.state.pageTitle} mode='stufenbrett' rth={this.props.match.params.rth} history={this.props.history} />
                    <div className="appBarSpacer"></div>

                    <Paper className="articleShowImagePlaceholder" style={{ height: imageH, transition: 'height 300ms' }}>
                        <img className="articleShowImage" alt="" style={{ height: imageH, transition: 'height 300ms' }} src={this.state.article.image} onLoad={() => { this.setState({ loadingBarOpacity: 0, fabOpacity: 1 }) }} />
                        <Button variant='fab' aria-label="Bilder anzeigen" className="articleFAB" style={{ opacity: this.state.fabOpacity, transition: 'opacity 300ms' }}>
                            <MoreImagesIcon />
                        </Button>
                    </Paper>

                    <LinearProgress className="imageLoadingBar" style={{ opacity: this.state.loadingBarOpacity }} />

                    <div className="articleTextWrapper" style={{ opacity: this.state.textOpacity }}>

                        <Typography variant="caption">
                            {this.state.article.date}
                        </Typography>

                        <Typography variant="headline" className="articleTitle">
                            {this.state.article.title}
                        </Typography>

                        {

                            this.state.article.attachment ?

                                <Chip className="articleChip" avatar={<Avatar><FileDownloadIcon /></Avatar>} label={"'" + this.state.article.attachment + "' herunterladen"} />

                                :

                                null

                        }


                        <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                            {this.state.article.text}
                        </Typography>

                    </div>


                </div>

            </MuiThemeProvider>



        );
    }

}




export default OpenStufenbrett;
