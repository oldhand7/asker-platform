const firebase = require('./firebase');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('before:run', async () => {
    await firebase.beforeRun()
  })
}
