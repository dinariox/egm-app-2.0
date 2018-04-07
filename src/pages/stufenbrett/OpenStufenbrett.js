import React, { Component, Fragment } from 'react';
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
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Zoom from 'material-ui/transitions/Zoom';
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';

import MoreImagesIcon from 'material-ui-icons/Collections';
import FileDownloadIcon from 'material-ui-icons/FileDownload';
import DoneIcon from 'material-ui-icons/Done';

import NotInterestedIcon from 'material-ui-icons/NotInterested';
import WarningIcon from 'material-ui-icons/Warning';
import MusicNoteIcon from 'material-ui-icons/MusicNote';
import DescriptionIcon from 'material-ui-icons/Description';
import InfoOutlineIcon from 'material-ui-icons/InfoOutline';
import TextsmsIcon from 'material-ui-icons/Textsms';


// Own Components
import ArticleAppBar from './../../components/ArticleAppBar';

import ImageTools from './../../ImageTools';


// Firebase References
import firebase from './../../firebase';
const db = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

let imageH = 0;

const colorList = [
    '#C62828',
    '#F44336',
    '#EF5350',
    '#AD1457',
    '#EC407A',
    '#4A148C',
    '#8E24AA',
    '#BA68C8',
    '#512DA8',
    '#303F9F',
    '#1565C0',
    '#42A5F5',
    '#039BE5',
    '#26C6DA',
    '#0097A7',
    '#4DB6AC',
    '#00897B',
    '#2E7D32',
    '#66BB6A',
    '#00E676',
    '#7CB342',
    '#DCE775',
    '#FFF176',
    '#FBC02D',
    '#FFB74D',
    '#EF6C00',
    '#D84315',
    '#8D6E63',
    '#795548',
    '#5D4037',
    '#E0E0E0',
    '#757575',
    '#90A4AE',
    '#455A64'
]


const iconList = [
    'warning',
    'music',
    'description',
    'infoOutline',
    'textsms'
]



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
                iconColor: ''
            },
            loadingBarOpacity: 1,
            fabOpacity: 0,
            textOpacity: 0,

            userIsAdmin: false,
            editMode: false,

            editID: 0,
            editTitle: '',
            editText: '',
            editDate: '',
            editIcon: '',
            editIconColor: '',

            showUploadProgress: false,
            uploadStatus: '',
            uploadProgress: 0,

            textSize: '11.2'
        };

    }

    componentDidMount() {

        this.loadArticle()

        // Hat der User Admin-Rechte?

        db.ref('/users/').orderByChild('uid').equalTo(auth.currentUser.uid).once('value').then((snapshot) => {

            let data = snapshot.val();
            let userInfo = data[Object.keys(data)[0]]
            this.setState({ userIsAdmin: userInfo.admin || userInfo.stufe === 'lehrer' ? true : false, textSize: userInfo.preferences.textSize || '11.2' });

        }).catch(err => {

            console.log('Error loading user data in OpenArticle:', err);

        });

    }


    loadArticle() {

        const articleID = parseInt(this.props.match.params.articleID);
        const stufe = parseInt(this.props.match.params.stufe);

        db.ref('stufenbrett/' + stufe).orderByChild('link').equalTo(articleID).once('value', snapshot => {

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

            // Wenn über die URL direkt in den edit Mode gesprungen werden soll (drei Punkte in der Liste -> Bearbeiten)
            if (this.props.match.params.editMode) this.enterEditMode();

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


    insertCurrentDate() {

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth(); // January is 0!
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        const monthNames = [
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

        today = dd + '. ' + monthNames[mm] + ' ' + yyyy;

        this.setState({ editDate: today });

    }


    enterEditMode() {

        let { article } = this.state;

        this.setState({
            editMode: true,
            editID: article.id,
            editTitle: article.title,
            editText: article.text,
            editDate: article.date,
            editIcon: article.icon,
            editIconColor: article.iconColor,
            editImage: article.image
        });

    }

  
    checkValidFiletype(file) {
        var fileTypes = [
            'image/png',
            'image/jpeg'
        ];

        for (var i = 0; i < fileTypes.length; i++) {
            if (file.type === fileTypes[i]) {
                return true;
            }
        }

        return false;
    }


    getFilesize(file) {
        var number = file.size

        if (number < 1024) {
            return number + ' Bytes';
        } else if (number > 1024 && number < 1048576) {
            return (number / 1024).toFixed(1) + ' KB';
        } else if (number > 1048576) {
            return (number / 1048576).toFixed(1) + ' MB';
        }

    }


    uploadChanges() {

        if (this.state.editTitle === '') {
            return alert('Bitte gib einen Titel ein');
        }
        if (this.state.editText.length < 10) {
            return alert('Bitte gib mindesten 10 Zeichen als Text ein');
        }
        if (this.state.editDate === '') {
            return alert('Bitte gib ein Datum ein');
        }
        if (this.state.editIcon === '') {
            return alert('Bitte wähle ein Icon aus');
        }
        if (this.state.editIconColor === '') {
            return alert('Bitte wähle eine Hintergrundfarbe für das Icon aus');
        }

        // if (this.state.editNewImageFile) {

        //     this.setState({

        //         showUploadProgress: true,
        //         uploadStatus: 'Bild wird hochgeladen...'

        //     })

        //     let fileName = this.state.editNewImageFile.name.replace(/\.[^/.]+$/, '');
        //     let parts = this.state.editNewImageFile.name.split('.');
        //     let fileExtension = parts[parts.length - 1];

        //     let uploadTask = storage.ref('artikel-bilder/' + new Date().getFullYear() + '/' + fileName + '_' + new Date().getTime() + '.' + fileExtension).put(this.state.editNewImageFile);

        //     uploadTask.on('state_changed', snapshot => {
        //         let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        //         this.setState({ uploadProgress: progress });

        //     }, error => {

        //         this.setState({

        //             showUploadProgress: false,
        //             uploadStatus: '',
        //             uploadProgress: 0

        //         })

        //         switch (error.code) {
        //             case 'storage/unauthorized':
        //                 return alert('Du hast leider keine Rechte zum Hochladen von Bildern. Wende dich an einen Admin');

        //             case 'storage/canceled':
        //                 return alert('Das Hochladen wurde abgebrochen');

        //             case 'storage/unknown':
        //                 return alert('Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut');
        //         }

        //     }, () => {

        //         // Upload completed successfully, now we can get the download URL
        //         var newImgUrl = uploadTask.snapshot.downloadURL

        //         this.setState({
        //             uploadStatus: 'Änderungen werden angewandt...'
        //         });


        //         let updateInfo = {
        //             titel: this.state.editTitle,
        //             text: this.state.editText.replace(/\n/g, '<br />'),
        //             datum: this.state.editDate,
        //             icon: this.state.editIcon,
        //             iconColor: this.state.editIconColor,
        //             link: this.state.editID
        //         }

        //         db.ref('stufenbrett/' + this.props.match.params.stufe + '/' + this.state.editID).update(updateInfo).then(() => {

        //             this.setState({

        //                 showUploadProgress: false,
        //                 uploadStatus: '',
        //                 uploadProgress: 0,
        //                 editMode: false,
        //                 editID: 0,
        //                 editTitle: '',
        //                 editText: '',
        //                 editDate: '',
        //                 editIcon: '',
        //                 editIconColor: '',
        //                 editMode: false

        //             });

        //             return alert('Der Artikel wurde erfolgreich aktualisiert'), this.props.history.push('/stufenbrett');

        //         }).catch((error) => {
        //             this.setState({

        //                 showUploadProgress: false,
        //                 uploadStatus: '',
        //                 uploadProgress: 0

        //             })

        //             console.error(error);
        //             return alert('Sorry, etwas ist schiefgelaufen');
        //         });

        //     });

        // } else {

            this.setState({

                showUploadProgress: true,
                uploadStatus: 'Änderungen werden angewandt...'

            });

            let updateInfo = {
                titel: this.state.editTitle,
                text: this.state.editText.replace(/\n/g, '<br />'),
                datum: this.state.editDate,
                icon: this.state.editIcon,
                iconColor: this.state.editIconColor,
                link: this.state.editID
            }

            db.ref('stufenbrett/' + this.props.match.params.stufe + '/' + this.state.editID).update(updateInfo).then(() => {

                this.setState({

                    showUploadProgress: false,
                    uploadStatus: '',
                    uploadProgress: 0,
                    editMode: false,
                    editID: 0,
                    editTitle: '',
                    editText: '',
                    editDate: '',
                    editIcon: '',
                    editIconColor: '',
                    editMode: false

                })

                return alert('Der Artikel wurde erfolgreich aktualisiert'), this.props.history.push('/stufenbrett');

            }).catch((error) => {
                this.setState({

                    showUploadProgress: false,
                    uploadStatus: '',
                    uploadProgress: 0

                })

                console.error(error);
                return alert('Sorry, etwas ist schiefgelaufen');
            });

        //}

    }


    cancleEdit() {

        let confirmCancle = window.confirm('Möchtest du das Bearbeiten wirklich abbrechen?\nAlle Änderungen gehen verloren');

        if (confirmCancle) {

            this.setState({
                editMode: false,
                editID: 0,
                editTitle: '',
                editText: '',
                editDate: '',
                editIcon: '',
                editIconColor: ''
            });

        }

    }

    deleteArticle(deleteFromWithinArticle) {

        let confirmDelete = window.confirm('Möchtest du den Artikel wirklich löschen?');

        if (confirmDelete) {

            db.ref('stufenbrett/' + this.props.match.params.stufe + '/' + this.props.match.params.articleID).remove().then(() => {

                if (deleteFromWithinArticle) {
                    this.props.history.push('/stufenbrett');
                } else {
                    this.loadArticle();
                }
                

                return alert('Der Artikel wurde erfolgreich gelöscht');

            }).catch(error => {

                return alert('Der Artikel konnte nicht gelöscht werden\n\n' + error.message);

            });

        }

    }

    render() {

        return (


            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <ArticleAppBar editMode={this.state.editMode} cancleEdit={() => this.cancleEdit()} editIcon={this.state.userIsAdmin && !this.state.editMode} deleteIcon={this.state.userIsAdmin && !this.state.editMode} deleteArticle={() => this.deleteArticle()} enterEditMode={() => this.enterEditMode()} title={this.state.pageTitle} mode='stufenbrett' rth={this.props.match.params.rth} history={this.props.history} />
                    <div className="appBarSpacer"></div>

                    {
                        this.state.editMode ||

                        <div>

                            <LinearProgress className="imageLoadingBar" style={{ opacity: this.state.loadingBarOpacity }} />

                            <div className="articleTextWrapper" style={{ opacity: this.state.textOpacity }}>

                                <Typography variant="caption">
                                    {this.state.article.date}
                                </Typography>

                                <Typography variant="headline" className="articleTitle">
                                    {this.state.article.title}
                                </Typography>

                                <Typography paragraph variant="body1" style={{ whiteSpace: 'pre-line', fontSize: this.state.textSize + 'pt' }} className="paragraphText">
                                    {this.state.article.text}
                                </Typography>

                                {

                                    this.state.article.attachments ?

                                        <Fragment>
                                            <Typography variant="caption" style={{ marginBottom: 8 }}>Anhänge</Typography>

                                            {
                                                this.state.article.attachments.map((attachment, index) => {

                                                    return (

                                                        <Chip onClick={() => { }} component="a" style={{ textDecoration: 'none', marginRight: 8 }} href={attachment.link} target="_blank" className="articleChip" avatar={<Avatar><FileDownloadIcon /></Avatar>} label={<span style={{ fontWeight: 500 }}>{attachment.name}</span>} />

                                                    );

                                                })
                                            }
                                        </Fragment>

                                        :

                                        null

                                }

                            </div>
                        </div>

                    }


                    {/* EDIT MODE */}

                    {
                        this.state.editMode &&

                        <div>


                            <Grid container spacing={16} style={{ padding: 16 }}>

                                <Grid item xs={12} sm={2}>

                                    <TextField
                                        disabled
                                        margin="none"
                                        id="editID"
                                        label="ID"
                                        value={this.state.editID}
                                        fullWidth
                                    />

                                </Grid>

                                <Grid item xs={12} sm={10}>

                                    <TextField
                                        margin="none"
                                        id="editTitle"
                                        label="Titel"
                                        value={this.state.editTitle}
                                        onChange={(event) => this.setState({ editTitle: event.target.value })}
                                        fullWidth
                                    />

                                </Grid>

                                <Grid item xs={12}>

                                    <TextField
                                        multiline
                                        rows={4}
                                        rowsMax={10}
                                        margin="none"
                                        id="editText"
                                        label="Text"
                                        value={this.state.editText}
                                        onChange={(event) => this.setState({ editText: event.target.value })}
                                        fullWidth
                                    />

                                </Grid>

                                <Grid item xs={9} sm={10} md={11}>

                                    <TextField
                                        margin="none"
                                        id="editDate"
                                        label="Datum"
                                        value={this.state.editDate}
                                        onChange={(event) => this.setState({ editDate: event.target.value })}
                                        fullWidth
                                    />

                                </Grid>

                                <Grid item xs={3} sm={2} md={1}>

                                    <Button onClick={() => this.insertCurrentDate()} fullWidth style={{ top: '50%', transform: 'translateY(-50%)' }}>Heute einfg.</Button>

                                </Grid>

                                <Typography style={{ fontSize: 16, margin: 8 }}>Icon:</Typography>

                                <div style={{ position: 'relative', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden' }}>
                                    <GridList style={{ flexWrap: 'nowrap', transform: 'translateZ(0)' }} cols={5.5}>
                                        {colorList.map(color => (
                                            <GridListTile key={color} style={{ height: 58 }}>
                                                <IconButton style={{ backgroundColor: color, transition: 'border-color 200ms', border: '4px solid', borderColor: this.state.editIconColor === color ? '#333' : 'white' }} onClick={() => this.setState({ editIconColor: color })}></IconButton>
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                </div>

                                <div style={{ position: 'relative', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden' }}>
                                    <GridList style={{ flexWrap: 'nowrap', transform: 'translateZ(0)' }} cols={4.5}>
                                        {iconList.map(icon => (
                                            <GridListTile key={icon} style={{ height: 58 }}>
                                                <IconButton style={{ color: 'white', backgroundColor: this.state.editIconColor ? this.state.editIconColor : '#666', transition: 'border-color 200ms, background-color 200ms', border: '4px solid', borderColor: this.state.editIcon === icon ? '#333' : 'white' }} onClick={() => this.setState({ editIcon: icon })}><ArticleIcon icon={icon} /></IconButton>
                                            </GridListTile>
                                        ))}
                                    </GridList>
                                </div>


                            </Grid>



                            <Zoom in={this.state.editMode && this.state.userIsAdmin}>
                                <Button variant="fab" className="stundenplanFAB" style={{ backgroundColor: '#4CAF50' }} onClick={() => this.uploadChanges()}>
                                    <DoneIcon />
                                </Button>
                            </Zoom>

                        </div>

                    }


                    {/* UPLOAD EDITED ARTICLE PROGRESS */}
                    <Dialog
                        aria-labelledby="simple-modal-title"
                        open={this.state.showUploadProgress}
                    >
                        <DialogTitle id="form-dialog-title">Artikel aktualisieren...</DialogTitle>
                        <DialogContent>
                            <LinearProgress variant="determinate" value={this.state.uploadProgress} />
                            <DialogContentText>
                                {this.state.uploadProgress}% - {this.state.uploadStatus}
                            </DialogContentText>
                        </DialogContent>
                    </Dialog>



                </div>

            </MuiThemeProvider>



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


export default OpenStufenbrett;
