import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';

import ArrowIcon from 'material-ui-icons/NavigateNext';
import NotInterestedIcon from 'material-ui-icons/NotInterested';
import WarningIcon from 'material-ui-icons/Warning';
import MusicNoteIcon from 'material-ui-icons/MusicNote';
import DescriptionIcon from 'material-ui-icons/Description';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import TextsmsIcon from 'material-ui-icons/Textsms';

import './ArticlesCard.css';

import firebase from './../firebase';
const db = firebase.database();


class ArticlesCard extends Component {

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
                db.ref('news').limitToLast(2).once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'news');

                });
                break;

            case 'sv':
                db.ref('sv').limitToLast(2).once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'sv');

                });
                break;

            case 'schulleitung':
                db.ref('schulleitung').limitToLast(2).once('value', snapshot => {

                    this.handleFirebaseArticles(snapshot, 'schulleitung');

                });
                break;
            default:
                return console.error('ArticlesCard mode nicht definiert oder gültig!');

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

            default:
                return console.error('ArticlesCard mode nicht definiert oder gültig!');

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
                                <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.news[0].link + '/true' }}>
                                    <Avatar style={{ backgroundColor: this.state.news[0].iconColor || 'Fehler' }}>
                                        <ArticleIcon icon={this.state.news[0].icon || 'Fehler'} />
                                    </Avatar>
                                    <ListItemText primary={this.state.news[0].titel || 'Fehler'} secondary={this.state.news[0].datum || 'Fehler'} />
                                </ListItem>
                                <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.news[1].link + '/true' }}>
                                    <Avatar style={{ backgroundColor: this.state.news[1].iconColor || 'Fehler' }}>
                                        <ArticleIcon icon={this.state.news[1].icon || 'Fehler'} />
                                    </Avatar>
                                    <ListItemText primary={this.state.news[1].titel || 'Fehler'} secondary={this.state.news[1].datum || 'Fehler'} />
                                </ListItem>
                            </List>

                            :

                            this.props.mode === 'sv' ?

                                <List className="articleList">
                                    <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.sv[0].link + '/true' }}>
                                        <Avatar style={{ backgroundColor: this.state.sv[0].iconColor || '' }}>
                                            <ArticleIcon icon={this.state.sv[0].icon || ''} />
                                        </Avatar>
                                        <ListItemText primary={this.state.sv[0].titel || 'Fehler'} secondary={this.state.sv[0].datum || 'Fehler'} />
                                    </ListItem>
                                    <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.sv[1].link + '/true' }}>
                                        <Avatar style={{ backgroundColor: this.state.sv[1].iconColor || '' }}>
                                            <ArticleIcon icon={this.state.sv[1].icon || ''} />
                                        </Avatar>
                                        <ListItemText primary={this.state.sv[1].titel || 'Fehler'} secondary={this.state.sv[1].datum || 'Fehler'} />
                                    </ListItem>
                                </List>

                                :

                                this.props.mode === 'schulleitung' ?

                                    <List className="articleList">
                                        <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.schulleitung[0].link + '/true' }}>
                                            <Avatar style={{ backgroundColor: this.state.schulleitung[0].iconColor || 'Fehler' }}>
                                                <ArticleIcon icon={this.state.schulleitung[0].icon || ''} />
                                            </Avatar>
                                            <ListItemText primary={this.state.schulleitung[0].titel || 'Fehler'} secondary={this.state.schulleitung[0].datum || 'Fehler'} />
                                        </ListItem>
                                        <ListItem button component={Link} to={{ pathname: '/archiv/open/' + this.props.mode + '/' + this.state.schulleitung[1].link + '/true' }}>
                                            <Avatar style={{ backgroundColor: this.state.schulleitung[1].iconColor || 'Fehler' }}>
                                                <ArticleIcon icon={this.state.schulleitung[1].icon || 'Fehler'} />
                                            </Avatar>
                                            <ListItemText primary={this.state.schulleitung[1].titel || 'Fehler'} secondary={this.state.schulleitung[1].datum || 'Fehler'} />
                                        </ListItem>
                                    </List>

                                    :

                                    null

                        :

                        <CircularProgress className="articlesLoadingCircle" style={{ color: this.props.loadColor }} />

                    }

                </div>

                <CardActions>

                    <Button size="small" onClick={() => { this.props.history.push('/archiv/' + this.props.mode) }}>Mehr lesen<ArrowIcon className="arrowIcon" /></Button>

                </CardActions>

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




export default ArticlesCard;