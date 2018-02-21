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

import './StufenbrettCard.css';

import firebase from './../firebase';
const db = firebase.database();


class StufenbrettCard extends Component {

    constructor(props) {

        super(props);

        this.state = {
            entries: [

            ],
            articlesLoaded: false
        };

    }


    componentDidMount() {

        db.ref('stufenbrett/11').once('value', snapshot => {

            this.handleFirebaseArticles(snapshot);

        });

    }


    handleFirebaseArticles(snapshot) {

        let sortedArticles = [];

        snapshot.forEach(childSnapshot => {

            sortedArticles.push(childSnapshot.val());

        });

        sortedArticles.reverse(); // Neue Artikel oben

        this.setState({ entries: sortedArticles, articlesLoaded: true });

    }


    render() {

        return (

            <Card className="articlesCard">

                <CardContent className="articleContent">

                    <Typography variant="subheading">{this.props.heading}</Typography>

                </CardContent>

                <div className="articlesListWrapper">

                    {this.state.articlesLoaded ?

                        <List className="articleList">

                            {this.state.entries.map((article) => {

                                return (

                                    <ListItem button key={article.link} component={Link} to={{ pathname: '/stufenbrett/open/' + article.link}} >
                                        <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                            <ArticleIcon icon={article.icon || 'Fehler'} />
                                        </Avatar>
                                        <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                    </ListItem>

                                );

                            })}

                        </List>

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




export default StufenbrettCard;