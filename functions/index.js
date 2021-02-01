const functions = require('firebase-functions');


// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.active_logs = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    if (req.body.coin < 0) {
        res.status(400).send('Coin must not be negative.');
        return;
    }

    if (req.body.os == "") {
        res.status(400).send('os must not be empty.');
        return;
    }
    
    const now = Date.now();
    req.body.created_at = now;
    const writeResult = await admin.firestore().collection('active_logs').add(req.body);

    res.status(200).send(writeResult.id);
  });

exports.get_active_logs = functions.https.onRequest(async (req, res) => {
    const response = [];
    const writeResult = await admin.firestore().collection('active_logs').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            response.push(doc.data());
        });
    }).catch(function(error) {
        res.status(400).send(error);
        return
    });

    res.status(200).send(response);
  });

exports.get_time = functions.region('asia-northeast1').https.onRequest((req, res) => {
    const now = Date.now();
    res.status(200).send({time:now});
  });