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
  beta: {
    apiKey: "AIzaSyBto0zX-ZMZ-CRbicOnwMvJrX79EYFtg7M",
    authDomain: "asker-beta.firebaseapp.com",
    projectId: "asker-beta",
    storageBucket: "asker-beta.appspot.com",
    messagingSenderId: "843130474301",
    appId: "1:843130474301:web:b98b983285a090adcbbf54"
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

export const UPLOAD_LIMIT_MB = getAppEnv() === 'testing' ? 1 : 50;
export const BUNDLE_UPLOAD_LIMIT_MB = getAppEnv() === 'testing' ? 2 : UPLOAD_LIMIT_MB * 2;
export const BUNDLE_MAX_FILES = getAppEnv() === 'testing' ? 3 : 5;
export const allowedHtmlTags = ['ul', 'ol', 'li', 'strong', 'p', 'em', 'br', 'b']
export const EVALUATION_SUBTYPES_NO_CRITERIA = ['culture-fit', 'motivation'];
export const COLOR_MAP = {
  'competency': '#43B88C',
  'experience': '#3D8976',
  'hard-skill': '#36A1CC',
  'motivation': '#FFBC5D',
  'culture-fit': '#4A67CE',
  'other': '#CCC',
  'screening': '#7844B8'
}
export const DEFAULT_STAGE_TIME = 5;
