import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from 'material-ui/Button';
import Card, { CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import Menu, { MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';

import NotInterestedIcon from 'material-ui-icons/NotInterested';
import WarningIcon from 'material-ui-icons/Warning';
import MusicNoteIcon from 'material-ui-icons/MusicNote';
import DescriptionIcon from 'material-ui-icons/Description';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import TextsmsIcon from 'material-ui-icons/Textsms';

import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import AddIcon from 'material-ui-icons/Add';

import './StufenbrettCard.css';

import firebase from './../firebase';
const db = firebase.database();
const auth = firebase.auth();


class StufenbrettCard extends Component {

    constructor(props) {

        super(props);

        this.state = {
            entries: [

            ],
            articlesLoaded: false,
            menuAnchorEl: null,
            userIsAdmin: false,
            clickedEntryID: 0
        };

    }


    componentDidMount() {

        // Hat der User Admin-Rechte?

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            let data = snapshot.val();
            let userInfo = data[Object.keys(data)[0]]
            this.setState({ userIsAdmin: userInfo.admin || userInfo.stufe === 'lehrer' ? true : false });

        }).catch(err => {

            console.log('Error loading user data in StufenbrettCard:', err);

        });

        this.loadArticles();

    }

    loadArticles() {

        db.ref('stufenbrett/' + this.props.stufe).once('value', snapshot => {

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


    handleOpenMenu(event) {
        this.setState({ menuAnchorEl: event.currentTarget });
    }


    deleteArticle() {

        let confirmDelete = window.confirm('Möchtest du den Artikel wirklich löschen?');

        if (confirmDelete) {

            db.ref('stufenbrett/' + this.props.stufe + '/' + this.state.clickedEntryID).remove().then(() => {

                return alert('Der Artikel wurde erfolgreich gelöscht'), this.loadArticles();

            }).catch(error => {

                return alert('Der Artikel konnte nicht gelöscht werden\n\n' + error.message);

            });

        }

    }


    render() {

        return (

            <Card className="articlesCard">

                <CardContent className="articleContent">

                    <Typography variant="subheading">Stufenbrett{this.props.stufe ? ' der Stufe ' + this.props.stufe : null}</Typography>
                    {this.state.userIsAdmin && <Button component={Link} to={'/stufenbrett/create/' + this.props.stufe} size="small" style={{ position: 'absolute', right: 8, top: 6 }}><AddIcon />&nbsp;Artikel erstellen</Button>}

                </CardContent>

                <div className="articlesListWrapper">

                    {this.state.articlesLoaded ?

                        <List className="articleList">

                            {this.state.entries.map((article) => {

                                return (

                                    <ListItem button key={article.link} component={Link} to={{ pathname: '/stufenbrett/open/' + this.props.stufe + '/' + article.link}} >
                                        <Avatar style={{ backgroundColor: article.iconColor || 'Fehler' }}>
                                            <ArticleIcon icon={article.icon || 'Fehler'} />
                                        </Avatar>
                                        <ListItemText primary={article.titel || 'Fehler'} secondary={article.datum || 'Fehler'} />
                                        {this.state.userIsAdmin &&
                                            <ListItemSecondaryAction>
                                                <IconButton onClick={event => { this.handleOpenMenu(event); this.setState({ clickedEntryID: article.link }) }}><MoreVertIcon /></IconButton>
                                            </ListItemSecondaryAction>
                                        }
                                    </ListItem>

                                );

                            })}

                        </List>

                        :

                        <CircularProgress className="articlesLoadingCircle" style={{ color: this.props.loadColor }} />

                    }

                </div>

                <Menu
                    id="edit-delete-menu"
                    anchorEl={this.state.menuAnchorEl}
                    open={Boolean(this.state.menuAnchorEl)}
                    onClose={() => this.setState({ menuAnchorEl: null })}
                >
                    <MenuItem component={Link} to={{ pathname: '/stufenbrett/open/' + this.props.stufe + '/' + this.state.clickedEntryID + '/true' }} onClick={this.handleCloseMenu}><EditIcon style={{ color: '#555', marginRight: 8 }} />Bearbeiten</MenuItem>
                    <MenuItem onClick={() => { this.setState({ menuAnchorEl: null }); this.deleteArticle() }}><DeleteIcon style={{ color: '#555', marginRight: 8 }} />Löschen</MenuItem>
                </Menu>

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