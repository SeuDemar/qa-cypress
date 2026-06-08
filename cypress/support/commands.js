Cypress.Commands.add('Login', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha)
  cy.get('[data-testid="entrar"]').click()
})

Cypress.Commands.add('Login_Token', (email, senha) => {
  cy.request({
    method: 'POST',
    url: 'https://serverest.dev/login',
    body: { email, password: senha }
  }).then((response) => {
    window.localStorage.setItem('serverest/userToken', response.body.authorization)
  })
  cy.visit('/home')
})
