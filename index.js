const {https} = require('firebase-functions');
const server = require('./server');

exports.nextjs = {
  server: https.onRequest(server),
};
