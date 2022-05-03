const { initializeApp, getApps } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
import { getAppEnv } from 'libs/config';

const firebaseServiceCreds = require(
  `./../../firebase-service-creds-${getAppEnv()}.json`
);

const getApp = (env = null) => {
    const apps = getApps()

    if (apps.length) {
      return apps[0]
    }

    firebaseServiceCreds.private_key = process.env.FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n');

    return initializeApp({
        credential: credential.cert(firebaseServiceCreds)
    });
}

module.exports = {
  getApp
}
