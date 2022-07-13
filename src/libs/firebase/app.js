const { initializeApp, getApps } = require("firebase/app");
import { getFirebaseConfig } from 'libs/config';

export const getApp = () => {
    const apps = getApps()

    if (apps.length) {
      return apps[0]
    }

    return initializeApp(getFirebaseConfig());
}
