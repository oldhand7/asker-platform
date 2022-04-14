const firebase = require('./firebase.js');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('before:run', async () => {
    await firebase.beforeRun()
  })
}
