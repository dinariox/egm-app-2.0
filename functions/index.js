
const uploadKey = '0000';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const xmlParser = require('xml2json');

const gcconfig = {
    projectId: "fb-cloud-functions-demo",
    keyFilename: "egm-app-beta-firebase-adminsdk-trd6k-dbd294fda7.json"
};

const gcs = require("@google-cloud/storage")(gcconfig);

admin.initializeApp(functions.config().firebase);



// PUSH NOTIFICATIONS

exports.sendNotification = functions.database.ref('notifications/{notificationId}').onWrite(event => {

    if (event.data.previous.val() || !event.data.exists()) {
        return;
    }

    const notification_snapshot = event.data;
    const payload = {
        notification: {
            title: notification_snapshot.val().title,
            body: notification_snapshot.val().message,
            icon: 'https://i.imgur.com/MQjZ2ip.png'
        }
    };

    console.info(payload);

    function cleanInvalidTokens(tokensWithKey, results) {

        const invalidTokens = [];

        results.forEach((result, i) => {
            
            if(!result.error) return;

            // Wenn error, dann fehlt hat User wahrscheinlich die Benachrichtigungen manuell deabonniert

            switch(result.error.code) {

                case 'messaging/invalid-registration-token':
                case 'messaging/registration-token-not-registered':

                    invalidTokens.push(admin.database().ref('/tokens').child(tokensWithKey[i].key).remove());
                    break;

                default:
                    break;

            }


        });

        console.warn('Tokens clean-up:', invalidTokens);

        return Promise.all(invalidTokens);

    }

    return admin.database().ref('/tokens').once('value').then(data => {

        if (!data.val()) return;

        const snapshot = data.val();
        const tokens = [];
        const tokensWithKey = [];

        for (let key in snapshot) {
            tokens.push(snapshot[key].token);
            tokensWithKey.push({
                token: snapshot[key].token,
                key: key
            });
        }

        console.info(tokens);

        return admin.messaging().sendToDevice(tokens, payload)
            .then((response) => cleanInvalidTokens(tokensWithKey, response.results)) // Tokens die nicht mehr aktiv/gültig sind löschen
            .then(() => admin.database().ref('/notifications').child(notification_snapshot.key).remove()); // Benachrichtigung aus Datenbank löschen

    });

});


exports.onFileUpload = functions.https.onRequest((req, res) => {

    cors(req, res, () => {

        if (req.method !== "POST") {
            return res.status(405).json({
                message: req.method + " is not allowed"
            });
        }

        if (!req.get('uploadKey')) {
            return res.status(400).json({
                message: 'No header uploadKey provided'
            });
        }

        if (req.get('uploadKey') !== uploadKey) {
            return res.status(401).json({
                message: 'Provided uploadKey is incorrect'
            });
        }

        const busboy = new Busboy({ headers: req.headers });
        let uploadData = {};

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

            console.log('Receiving file with name', filename);

            let xmlString = '';

            file.on('data', buffer => {

                xmlString += buffer.toString();

            });

            file.on('end', buffer => {

                let jsonText = xmlParser.toJson(xmlString);
                let jsonObj = JSON.parse(jsonText);
                console.info('Converting ' + filename + ' XML to JSON done');

                switch (fieldname) {

                    case 'planH':
                        sortPlanByClasses('currentDay', jsonObj);
                        break;
                    case 'planM':
                        sortPlanByClasses('nextDay', jsonObj);
                        break;
                    default:
                        break;

                }

            });

            const filepath = path.join(os.tmpdir(), filename);
            uploadData[fieldname] = { file: filepath, type: mimetype };
            file.pipe(fs.createWriteStream(filepath));

        });

        busboy.on("finish", () => {

            const bucket = gcs.bucket("egm-app-beta.appspot.com");
            bucket
                .upload(uploadData['planH'].file, {
                    uploadType: "media",
                    metadata: {
                        metadata: {
                            contentType: uploadData['planH'].type
                        }
                    }
                })
                .then(() => {
                    bucket
                        .upload(uploadData['planM'].file, {
                            uploadType: "media",
                            metadata: {
                                metadata: {
                                    contentType: uploadData['planM'].type
                                }
                            }
                        }).then(()=> {
                            res.status(200).json({
                                message: "Plans successfully uploaded!"
                            });
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                    
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });

        });

        return busboy.end(req.rawBody);
        
    });

    

    function sortPlanByClasses(day, planJson) {

        console.info('Sorting plan for', day, 'with data:', planJson);

        let planInfo = planJson.vertretungsplaene.plan;

        let abwesendeLehrer = planInfo.fehlende.lehrer;

        let stufen = {
            '5': [],
            '6': [],
            '7': [],
            '8': [],
            '9': [],
            'EF': [],
            'Q1': [],
            'Q2': []
        }

        let vertretungen = planInfo.vertretungen.stunde;


        stufen['5'] = vertretungen.filter(entry => {
            return entry.klasse.includes('05') || entry.klasse.includes('W5FÖ') || entry.klasse.includes('FWE5');
        });
        stufen['6'] = vertretungen.filter(entry => {
            return entry.klasse.includes('06') || entry.klasse.includes('FÖ6') || entry.klasse.includes('LFS6') || entry.klasse.includes('FWE6');
        });
        stufen['7'] = vertretungen.filter(entry => {
            return entry.klasse.includes('07') || entry.klasse.includes('FÖ7') || entry.klasse.includes('LFS7') || entry.klasse.includes('R7');
        });
        stufen['8'] = vertretungen.filter(entry => {
            return entry.klasse.includes('08') || entry.klasse.includes('8DI') || entry.klasse.includes('FÖ8') || entry.klasse.includes('LFS8') || entry.klasse.includes('R8');
        });
        stufen['9'] = vertretungen.filter(entry => {
            return entry.klasse.includes('09') || entry.klasse.includes('9DI') || entry.klasse.includes('LFS9') || entry.klasse.includes('R9');
        });
        stufen['EF'] = vertretungen.filter(entry => {
            return entry.klasse.includes('EF');
        });
        stufen['Q1'] = vertretungen.filter(entry => {
            return entry.klasse.includes('Q1');
        });
        stufen['Q2'] = vertretungen.filter(entry => {
            return entry.klasse.includes('Q2');
        });


        stufen['5'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['6'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['7'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['8'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['9'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['EF'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['Q1'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });
        stufen['Q2'].sort((a, b) => { return (a.stunde > b.stunde) ? 1 : ((b.stunde > a.stunde) ? -1 : 0); });


        console.info('Missing Teachers for', day, abwesendeLehrer);
        console.info('Sortierte Vertretungen for', day, stufen);

        let forDate = {
            dayOfWeek: planInfo.wochentag,
            day: planInfo.tag,
            month: planInfo.monat,
            year: planInfo.jahr
        };

        let updatedDate = {
            time: planJson.vertretungsplaene.uhrzeit,
            day: planJson.vertretungsplaene.tag,
            month: planJson.vertretungsplaene.monat,
            year: planJson.vertretungsplaene.jahr
        };

        console.info('Plan', day, 'for', forDate);
        console.info('Plan', day, 'created', updatedDate);

        admin.database().ref('/vertretungsplan/' + day + '/abwesendeLehrer').set(abwesendeLehrer);
        admin.database().ref('/vertretungsplan/' + day + '/vertretungen').set(stufen);
        admin.database().ref('/vertretungsplan/' + day + '/forDate').set(forDate);
        admin.database().ref('/vertretungsplan/' + day + '/updatedDate').set(updatedDate);

    }


});


exports.validateStufenpasswort = functions.https.onRequest((req, res) => {

    cors(req, res, () => {

        console.log(req.get('stufenpasswort'));

        res.set({
            'Access-Control-Allow-Credentials': true
        });
        return res.status(200).send(req.get('stufenpasswort'));

    });

});
