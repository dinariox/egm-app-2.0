import React, { Component, Fragment } from 'react';
import 'typeface-roboto';
import { Link } from 'react-router-dom';

import './../main.css';

// MUI
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './../theme';

// MUI Colors


// MUI Components
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';

import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

// Own components
import EGMAppBar from './../components/EGMAppBar';


// Firebase References
// import firebase from './../firebase';
// const db = firebase.database();
// const auth = firebase.auth();
// const storage = firebase.storage();


class Impressum extends Component {

    constructor() {

        super();

        this.state = {

            pageTitle: 'Impressum'

        }

    }

    render() {
        return (

            <MuiThemeProvider theme={theme}>

                <div style={{ backgroundColor: '#fbfbfb', minHeight: '100vh' }}>

                    <CssBaseline />

                    <EGMAppBar title={this.state.pageTitle} />
                    <div className="appBarSpacer"></div>

                    <Typography style={{ margin: 16, marginBottom: 0 }} variant="headline">Angaben gemäß § 5 TMG</Typography>

                    <Typography style={{ margin: 16, fontSize: '11.2pt' }}>

                        Evangelisches Gymnasium Meinerzhagen<br />
                        Christoph-Friedrich-Baehrens-Straße<br />
                        58540 Meinerzhagen<br />
                        <span style={{ fontWeight: 500 }}>Tel:</span> 02354 / 92380&nbsp;&nbsp;<span style={{ fontWeight: 500 }}>Fax:</span> 02354 / 923869<br />
                        <span style={{ fontWeight: 500 }}>eMail:</span> info@ev-g-m.de<br />
                        <span style={{ fontWeight: 500 }}>Schulleitung:</span> OStD i.K. S. Dombrowski<br />
                        <span style={{ fontWeight: 500 }}>Schulträger (Diensteanbieter im Sinne des TDG/MDStV):</span> Evangelische Kirche von Westfalen, Bielefeld<br />
                        <span style={{ fontWeight: 500 }}>Zuständige Aufsichtsbehörde:</span> Bezirksregierung Arnsberg<br />
                        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV<br />
                        OStD i.K. S. Dombrowski

                    </Typography>

                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <Button color="primary" href="http://ev-g-m.de" target="_blank">Schulhomepage</Button>
                        <Button color="primary" href="mailto:info@ev-g-m.de" target="_blank">Schule kontaktieren</Button>
                    </div>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Haftung für Inhalte</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. 
                                <br />Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. 
                                <br />Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Haftung für Links</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                                <br />Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. 
                                <br />Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Urheberrecht</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Typography>
                                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                                <br />Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. 
                                <br />Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography style={{ fontSize: '12pt' }}>Datenschutz</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{ display: 'block' }}>
                            <Typography paragraph>
                                Die Betreiber dieser Seite/App nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Diese Daten werden nicht an Dritte weitergegeben. Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
                            </Typography>
                            <Typography paragraph variant="subheading">
                                Auskunft, Löschung, Sperrung
                            </Typography>
                            <Typography paragraph>
                                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Einstellungsbereich der Website/App angegebenen Support-Adresse an uns wenden.
                            </Typography>
                            <Typography paragraph variant="subheading">
                                Widerspruch Werbe-Mails
                            </Typography>
                            <Typography paragraph>
                                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seite/App behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
                            </Typography>
                            <Typography paragraph variant="subheading">
                                Server-Log-Files
                            </Typography>
                            <Typography paragraph>
                                Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log Files, die Ihr Browser automatisch an uns übermittelt. Dies sind: 
                                <br />- Vor- bzw. Nachname
                                <br />- E-Mail Adresse
                                <br />- Referrer URL
                                <br />- Datum der Serveranfrage
                                <br />Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn uns konkrete Anhaltspunkte für eine rechtswidrige Nutzung bekannt werden.
                            </Typography>
                            <Typography paragraph variant="subheading">
                                Datenschutzerklärung für die Nutzung von Google Analytics
                            </Typography>
                            <Typography paragraph>
                                Diese Website/App nutzt Funktionen des Webanalysedienstes Google Analytics. Anbieter ist die Google Inc., 1600 Amphitheatre Parkway Mountain View, CA 94043, USA. Google Analytics verwendet sog. "Cookies". Das sind Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Mehr Informationen zum Umgang mit Nutzerdaten bei Google Analytics finden Sie in der Datenschutzerklärung von Google: https://support.google.com/analytics/answer/6004245?hl=de
                            </Typography>
                            <Typography paragraph variant="subheading">
                                Browser Plugin
                            </Typography>
                            <Typography paragraph>
                                Sie können die Speicherung der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website/App vollumfänglich werden nutzen können. Sie können darüber hinaus die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website bezogenen Daten (inkl. Ihrer IP-Adresse) an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und installieren: https://tools.google.com/dlpage/gaoptout?hl=de
                            </Typography>
                            <Typography paragraph variant="subheading">
                                IP-Anonymisierung
                            </Typography>
                            <Typography paragraph>
                                Wir nutzen die Funktion "Aktivierung der IP-Anonymisierung" auf dieser Webseite/App. Dadurch wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt. Nur in Ausnahmefällen wird die volle IP-Adresse an einen Server von Google in den USA übertragen und dort gekürzt. Im Auftrag des Betreibers dieser Website wird Google diese Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um Reports über die Websiteaktivitäten zusammenzustellen und um weitere mit der Websitenutzung und der Internetnutzung verbundene Dienstleistungen gegenüber dem Websitebetreiber zu erbringen. Die im Rahmen von Google Analytics von Ihrem Browser übermittelte IP-Adresse wird nicht mit anderen Daten von Google zusammengeführt.
                            </Typography>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                </div>


            </MuiThemeProvider>



        );
    }
}



export default Impressum;
