describe('User Joe', () => {
  beforeEach(() => {
    cy.login('joe.doe@example.com', 'test123', 'user-joe')
  })

  it('should be identified as user that is logged in', () => {
    cy.visit('/')

    cy.get('[data-test-id=user-card]').contains('Joe Doe')

    cy.request('/api/auth/check/')
      .should((response) => {
        expect(response.status).to.eq(200)
      })
  })

  it('should be abble to edit profile', () => {
    cy.visit('/profile/')

    cy.get('form[data-test-id="admin-profile-form"]').within(() => {
      cy.get('input[name="name"]').should('have.value', 'Joe Doe').type('{selectall}{backspace}Joe D.')
      cy.get('input[name="email"]').should('have.value', 'joe.doe@example.com')
      cy.get('input[name="phone"]').should('have.value', '').type('+37061112223')
    }).submit()

    cy.contains('Your profile was updated!')

    cy.get('[data-test-id="user-card"]').contains('Joe D.')

    cy.reload()

    cy.get('[data-test-id="user-card"]').contains('Joe D.')
  })

  it('should be able to change email', () => {
    cy.visit('/profile/')

    cy.get('form[data-test-id="admin-profile-form"]').within(() => {
      cy.get('input[name="email"]').type('{selectAll}{backspace}j.doe@hotmail.net')
    }).submit()

    cy.get('#password-modal')
      .find('input[name="password"]').type('test123')
      .closest('form')
      .submit()

    cy.contains('Your profile was updated!')

    cy.visit('/logout/').wait(2000)

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]').type('joe.doe@example.com')
      cy.get('input[type="password"][name="password"]').type('test123')
    }).submit()

    cy.contains('Email or password invalid')

    cy.simpleLogin('j.doe@hotmail.net', 'test123', 2000)

    cy.visit('/profile/')

    cy.get('[data-test-id=user-card]').contains('Joe')
  })
})

describe('User Jane', () => {
  beforeEach(() => {
    cy.login('jane.doe@example.com', 'test123', 'user-jane')
  })

  it('should be abble to change password', () => {
    cy.visit('/profile/')

    cy.get('input[name="email"]').should('have.value', 'jane.doe@example.com')
    cy.contains('Change password').click()
    cy.get('input[name="password"]').type('foo123')
    cy.get('input[name="password_confirmation"]').type('foo123')
    cy.get('form[data-test-id="admin-profile-form"]').submit()

    cy.get('#password-modal')
      .find('input[name="password"]').type('test123')
      .closest('form')
      .submit()

    cy.contains('Your profile was updated!')
    cy.visit('/logout/')
    cy.location('pathname').should('eq', '/login/').wait(2000)

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]').type('jane.doe@example.com')
      cy.get('input[type="password"][name="password"]').type('test123')
    }).submit()

    cy.contains('Email or password invalid')

    cy.get('form[data-test-id="login-form"]').within(() => {
      cy.get('input[type="text"][name="email"]').type('{selectAll}{backspace}jane.doe@example.com')
      cy.get('input[type="password"][name="password"]').type('{selectAll}{backspace}foo123')
    }).submit()

    cy.get('[data-test-id=user-card]').contains('Jane')
  })
})
