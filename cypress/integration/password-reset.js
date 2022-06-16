describe('Password reset', () => {
  it('should reset password', () => {
      cy.visit('/')

      cy.contains('Forgotten?').click()

      cy.location('pathname').should('eq', '/forgotten/')

      cy.get('input[name="email"]').type('joe.stevens@example.com')
      cy.contains('Send password reset link').click()

      cy.get('[data-test-id="alert-success"]')
        .should('contain', 'Password reset link sent')

      cy.wait(5000)

      cy.location('pathname').should('eq', '/login/')

      cy.task('getLastEmail', 'joe.stevens@example.com')
        .its('html')
        .then((html) => {
          cy.document().invoke('write', html)
          cy.contains('Password change', { matchCase : false})

          cy.get('a')
            .then($el => {
              const href = $el.attr('href')

              cy.origin(`https://${process.env['FIREBASE_AUTH_EMULATOR_HOST']}`, { args: { href }}, ({ href }) => {
                cy.request(href + '&newPassword=test111')
              })

              cy.simpleLogin('joe.stevens@example.com', 'test111', true)
            })
        })
  })
})
