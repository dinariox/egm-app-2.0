import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card, { CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';

import NotInterestedIcon from 'material-ui-icons/NotInterested';
import WarningIcon from 'material-ui-icons/Warning';
import MusicNoteIcon from 'material-ui-icons/MusicNote';
import DescriptionIcon from 'material-ui-icons/Description';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import TextsmsIcon from 'material-ui-icons/Textsms';

import './FullArticlesCard.css';

import firebase from './../firebase';
const db = firebase.database();


class FullArticlesCard extends Component {

    constructor(props) {

        super(props);

        this.state = {
            news: [

            ],
            sv: [

            ],
            schulleitung: [

            ],
            articlesLoaded: false
        };

    }


    componentDidMount() {


        switch (this.props.mode) {

            case 'news':
                db.ref('news').once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'news');

                });
                break;

            case 'sv':
                db.ref('sv').once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'sv');

                });
                break;

            case 'schulleitung':
                db.ref('schulleitung').once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'schulleitung');

                });
                break;

            case 'stufenbrett':
                db.ref('stufenbrett').once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'stufenbrett');

                });
                break;

            default:
                return console.error('FullArticlesCard mode nicht definiert oder gültig!');

        }

    }


    handleFirebaseArticles(snapshot, mode) {

        let sortedArticles = [];

        snapshot.forEach(childSnapshot => {

            sortedArticles.push(childSnapshot.val());

        });

        sortedArticles.reverse(); // Neue Artikel oben

        switch (mode) {

            case 'news':
                this.setState({ news: sortedArticles });
                break;

            case 'sv':
                this.setState({ sv: sortedArticles });
                break;

            case 'schulleitung':
                this.setState({ schulleitung: sortedArticles });
                break;

            case 'stufenbrett':
                this.setState({ stufenbrett: sortedArticles });
                break;

            default:
                return console.error('FullArticlesCard mode nicht definiert oder gültig!');

        }

        this.setState({ articlesLoaded: true });

    }


    render() {

        return (

            <Card className="articlesCard">

                <CardContent className="articleContent">

                    <Typography variant="subheading">{this.props.heading}</Typography>

                </CardContent>

                <div className="articlesListWrapper">

                    {this.state.articlesLoaded ?

                        this.props.mode === 'news' ?

                            <List className="articleList">
                                
                                {this.state.news.map((article) => {

                                    return (

                                        <ListItem button key={article.link} component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + article.link + '/false' }} >
                                            <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                                <ArticleIcon icon={article.icon || 'Fehler'} />
                                            </Avatar>
                                            <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                        </ListItem>

                                    );

                                })}
                                
                            </List>

                            :

                            this.props.mode === 'sv' ?

                                <List className="articleList">

                                    {this.state.sv.map((article) => {

                                        return (

                                            <ListItem button key={article.link} component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + article.link + '/false' }}>
                                                <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                                    <ArticleIcon icon={article.icon || 'Fehler'} />
                                                </Avatar>
                                                <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                            </ListItem>

                                        );

                                    })}

                                </List>

                                :

                                this.props.mode === 'schulleitung' ?

                                    <List className="articleList">
                                        
                                        {this.state.schulleitung.map((article) => {

                                            return (

                                                <ListItem button key={article.link} component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + article.link + '/false' }}>
                                                    <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                                        <ArticleIcon icon={article.icon || 'Fehler'} />
                                                    </Avatar>
                                                    <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                                </ListItem>

                                            );

                                        })}

                                    </List>

                                    :

                                    this.props.mode === 'stufenbrett' ?

                                        <List className="articleList">

                                            {this.state.stufenbrett.map((article) => {

                                                return (

                                                    <ListItem button key={article.link} component={Link} to={{ pathname: '/stufenbrett/open/' + article.link}}>
                                                        <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                                            <ArticleIcon icon={article.icon || 'Fehler'} />
                                                        </Avatar>
                                                        <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                                    </ListItem>

                                                );

                                            })}

                                        </List>

                                        :

                                        null

                        :

                        <CircularProgress className="articlesLoadingCircle" style={{ color: this.props.loadColor }} />

                    }

                </div>

            </Card>

        );

    }

}


function ArticleIcon(props) {

    switch (props.icon) {

        case 'warning':
            return <WarningIcon />;
        case 'music':
            return <MusicNoteIcon />;
        case 'description':
            return <DescriptionIcon />;
        case 'infoOutline':
            return <InfoOutlineIcon />;
        case 'textsms':
            return <TextsmsIcon />;
        default:
            return <NotInterestedIcon />;
    }



}




export default FullArticlesCard;