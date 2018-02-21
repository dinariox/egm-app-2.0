
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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