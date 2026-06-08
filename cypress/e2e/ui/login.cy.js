describe('Tela de Login', () => {

  it('Login com sucesso', () => {
    cy.cadastraUsuario('Vitor Teste', 'vitor_login@teste.com', 'teste123', 'false')

    cy.Login('vitor_login@teste.com', 'teste123')

    cy.url().should('include', '/home')
    cy.get('[data-testid="logout"]').should('be.visible')

    cy.deleteUsuario('vitor_login@teste.com')
  })

  it('Login sem sucesso - credenciais incorretas', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('email_errado@teste.com')
    cy.get('[data-testid="senha"]').type('senha_errada')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email e/ou senha inválidos').should('be.visible')
  })

  it('Login sem sucesso - campos vazios', () => {
    cy.visit('/login')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
  })

  it('Login sem sucesso - email inválido', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('emailsemarroba')
    cy.get('[data-testid="senha"]').type('teste123')
    cy.get('[data-testid="entrar"]').click()

    cy.url().should('include', '/login')
    cy.get('[data-testid="entrar"]').should('be.visible')
  })

  it('Login sem sucesso - apenas email preenchido', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('vitor@teste.com')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Password é obrigatório').should('be.visible')
  })

  it('Login sem sucesso - apenas senha preenchida', () => {
    cy.visit('/login')
    cy.get('[data-testid="senha"]').type('teste123')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email é obrigatório').should('be.visible')
  })

  it('Logout com sucesso', () => {
    cy.cadastraUsuario('Vitor Teste', 'vitor_logout@teste.com', 'teste123', 'false')
    cy.Login_Token('vitor_logout@teste.com', 'teste123')

    cy.get('[data-testid="logout"]').click()

    cy.url().should('include', '/login')

    cy.deleteUsuario('vitor_logout@teste.com')
  })

  it('Redirecionamento para home após login com sucesso', () => {
    cy.cadastraUsuario('Vitor Teste', 'vitor_redirect@teste.com', 'teste123', 'false')

    cy.Login('vitor_redirect@teste.com', 'teste123')

    cy.url().should('include', '/home')
    cy.get('[data-testid="logout"]').should('be.visible')

    cy.deleteUsuario('vitor_redirect@teste.com')
  })

})
