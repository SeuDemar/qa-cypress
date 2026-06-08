describe('Cadastro de Usuário', () => {

  it('Cadastro de usuário regular com sucesso', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Vitor Regular')
    cy.get('[data-testid="email"]').type('vitor_reg@teste.com')
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="checkbox"]').uncheck()
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.ehAdm('Vitor Regular', 'vitor_reg@teste.com', 'nao')

    cy.deleteUsuario('vitor_reg@teste.com')
  })

  it('Cadastro de usuário administrador com sucesso', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Vitor Admin')
    cy.get('[data-testid="email"]').type('vitor_adm@teste.com')
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="checkbox"]').check()
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Cadastro realizado com sucesso').should('be.visible')
    cy.ehAdm('Vitor Admin', 'vitor_adm@teste.com', 'sim')

    cy.deleteUsuario('vitor_adm@teste.com')
  })

  it('Cadastro sem sucesso - sem credenciais fornecidas', () => {
    cy.intercept('POST', '**/usuarios').as('Cadastro_Usuario')
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Nome é obrigatório').should('be.visible')
    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
    cy.wait('@Cadastro_Usuario')
      .its('response.statusCode').should('eq', 400)
  })

  it('Cadastro sem sucesso - usuário já cadastrado', () => {
    cy.intercept('POST', '**/usuarios', {
      statusCode: 400,
      body: { message: 'Este email já está sendo usado' }
    })
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Vitor Duplicado')
    cy.get('[data-testid="email"]').type('duplicado@teste.com')
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.get('.alert-dismissible').should('contain', 'Este email já está sendo usado')
  })

  it('Cadastro sem sucesso - email inválido', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Vitor Invalido')
    cy.get('[data-testid="email"]').type('emailsemarroba')
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Email deve ser um email válido').should('be.visible')
  })

  it('Cadastro sem sucesso - sem nome', () => {
    cy.intercept('POST', '**/usuarios').as('Cadastro_SemNome')
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="email"]').type('vitor_semnome@teste.com')
    cy.get('[data-testid="password"]').type('teste123')
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Nome é obrigatório').should('be.visible')
    cy.wait('@Cadastro_SemNome')
      .its('response.statusCode').should('eq', 400)
  })

  it('Cadastro sem sucesso - sem senha', () => {
    cy.intercept('POST', '**/usuarios').as('Cadastro_SemSenha')
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type('Vitor Sem Senha')
    cy.get('[data-testid="email"]').type('vitor_semsenha@teste.com')
    cy.get('[data-testid="cadastrar"]').click()

    cy.contains('Password é obrigatório').should('be.visible')
    cy.wait('@Cadastro_SemSenha')
      .its('response.statusCode').should('eq', 400)
  })

})
