const firebase = require('./firebase');
const smtp = require('smtp-tester')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  const mailServer = smtp.init(8025)

  let lastEmail = {}

  mailServer.bind((addr, id, email) => {
    // store the email by the receiver email
    lastEmail[email.headers.to] = {
      body: email.body,
      html: email.html,
    }
  })

  on('task', {
    resetEmails(email) {
      if (email) {
        delete lastEmail[email]
      } else {
        lastEmail = {}
      }
      return null
    },

    getLastEmail(userEmail) {
      return lastEmail[userEmail] || null
    },
  })

  on('before:run', async () => {
    await firebase.beforeRun()
  })
}
