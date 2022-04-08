describe('User', () => {
  beforeEach(() => {
    cy.visit('/login/', { failOnStatusCode: false })

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]').type('joe.doe@example.com')
      cy.get('input[type="password"][name="password"]').type('test123')
    }).submit().wait(2000)
  })

  it('should be redirected to projects page', () => {
    cy.location('pathname').should('eq', '/projects/')
  })

  it('should be identified as user that is logged in', () => {
    cy.get('[data-test-id=user-card]').contains('Joe Doe')

    cy.request('/api/auth/check/')
      .should((response) => {
        expect(response.status).to.eq(200)
      })
  })

  it('should be abble to edit profile', () => {
    cy.wait(2000).visit('/profile/')

    cy.get('form[data-test-id="admin-profile-form"]').within(() => {
      cy.get('input[name="displayName"]').should('have.value', 'Joe Doe').type('{selectall}{backspace}Joe D.')
      cy.get('input[name="email"]').should('have.value', 'joe.doe@example.com')
      cy.get('input[name="phoneNumber"]').should('have.value', '').type('+37061112223')
    }).submit()

    cy.contains('Your profile was updated!')

    cy.get('[data-test-id="user-card"]').contains('Joe D.')

    cy.reload()

    cy.get('[data-test-id="user-card"]').contains('Joe D.')
  })

  it('should logout', () => {
    cy.visit('/logout/')

    cy.get('#navbar').contains('Login')
  })
})
