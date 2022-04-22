export const i18n = require('./../../i18n.json')

export const getAppEnv = () => {
  return process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';
}

export const firebaseConfig = {
  production: {
    apiKey: "AIzaSyBxG11gKwZ0W4UxZlAtHU8UuLzV-oVnrcw",
    authDomain: "asker-3e929.firebaseapp.com",
    projectId: "asker-3e929",
    storageBucket: "asker-3e929.appspot.com",
    messagingSenderId: "546816163571",
    appId: "1:546816163571:web:3826c408d81bc00e6d4186"
  },
  development: {
    apiKey: "AIzaSyCmTfkWiv5sA89hDOkCAXA7xa3wNMbfoyQ",
    authDomain: "asker-dev.firebaseapp.com",
    projectId: "asker-dev",
    storageBucket: "asker-dev.appspot.com",
    messagingSenderId: "231947786245",
    appId: "1:231947786245:web:f380f80a541bb63c51e46c"
  },
  testing: {
    apiKey: "AIzaSyAyZFLSrKqmgALtFcx-To2gXQZHx65gSdQ",
    authDomain: "asker-test-98028.firebaseapp.com",
    projectId: "asker-test-98028",
    storageBucket: "asker-test-98028.appspot.com",
    messagingSenderId: "448315134556",
    appId: "1:448315134556:web:72d9db736c83d9991d4c99"
  }
}

export const getFirebaseConfig = () => {
  return firebaseConfig[getAppEnv()]
}

export const UPLOAD_LIMIT_MB = 5;
export const BUNDLE_UPLOAD_LIMIT_MB = UPLOAD_LIMIT_MB * 2;
export const BUNDLE_MAX_FILES = 3;
