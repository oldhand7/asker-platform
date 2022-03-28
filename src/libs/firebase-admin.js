const { initializeApp, getApps, applicationDefault } = require("firebase-admin/app");
const { credential } = require("firebase-admin");

const firebaseServiceCreds = require('./../../firebase-service-creds.json');

const getApp = () => {
    const apps = getApps()

    if (apps.length) {
      return apps[0]
    }

    firebaseServiceCreds.private_key = process.env.FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n');

    return initializeApp({
        credential: credential.cert(firebaseServiceCreds),
        databaseURL: 'https://asker-3e929.firebaseio.com'
    });
}

module.exports = {
  getApp
}
