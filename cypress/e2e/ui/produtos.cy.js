describe('Busca de Produtos - UI', () => {
  beforeEach(() => {
    ['vitor_produtos@teste.com', 'vitor_produtos2@teste.com', 'vitor_produtos3@teste.com', 'vitor_produtos4@teste.com', 'vitor_produtos5@teste.com'].forEach((email) => {
      cy.request({ method: 'GET', url: 'https://serverest.dev/usuarios', qs: { email } })
        .then((res) => { if (res.body.quantidade > 0) cy.deleteUsuario(email) })
    })
  })

  it('Buscar por item existente', () => {
    cy.cadastraUsuario('Vitor Produtos', 'vitor_produtos@teste.com', 'teste123', 'false')
    cy.login_api('vitor_produtos@teste.com', 'teste123', 'home')

    cy.get('[data-testid="pesquisar"]').type('Logitech MX Vertical')
    cy.get('[data-testid="botaoPesquisar"]').click()

    cy.get('.card-body').should('have.length', 1)
    cy.contains('Logitech MX Vertical').should('be.visible')

    cy.deleteUsuario('vitor_produtos@teste.com')
  })

  it('Buscar por item inexistente', () => {
    cy.cadastraUsuario('Vitor Produtos', 'vitor_produtos2@teste.com', 'teste123', 'false')
    cy.login_api('vitor_produtos2@teste.com', 'teste123', 'home')

    cy.get('[data-testid="pesquisar"]').type('ProdutoQueNaoExiste99999')
    cy.get('[data-testid="botaoPesquisar"]').click()

    cy.get('.card-body').should('have.length', 0)

    cy.deleteUsuario('vitor_produtos2@teste.com')
  })

  it('Pesquisar por itens mockados via fixture', () => {
    cy.cadastraUsuario('Vitor Produtos', 'vitor_produtos3@teste.com', 'teste123', 'false')
    cy.login_api('vitor_produtos3@teste.com', 'teste123', 'home')

    cy.get('[data-testid="pesquisar"]').type('Produto')

    cy.intercept(
      'GET',
      '**/produtos?nome=Produto',
      { fixture: 'mock_produtos' }
    ).as('getProdutos')

    cy.get('[data-testid="botaoPesquisar"]').click()
    cy.wait('@getProdutos')
    cy.get('.card-body').should('have.length', 3)

    cy.deleteUsuario('vitor_produtos3@teste.com')
  })

  it('Listar todos os produtos na home', () => {
    cy.cadastraUsuario('Vitor Produtos', 'vitor_produtos4@teste.com', 'teste123', 'false')
    cy.login_api('vitor_produtos4@teste.com', 'teste123', 'home')

    cy.get('.card-body').should('have.length.greaterThan', 0)

    cy.deleteUsuario('vitor_produtos4@teste.com')
  })

  it('Interceptar requisição de produtos e validar status code', () => {
    cy.cadastraUsuario('Vitor Produtos', 'vitor_produtos5@teste.com', 'teste123', 'false')
    cy.login_api('vitor_produtos5@teste.com', 'teste123', 'home')

    cy.intercept('GET', '**/produtos**').as('getProdutosHome')

    cy.reload()
    cy.wait('@getProdutosHome')
      .its('response.statusCode').should('eq', 200)

    cy.deleteUsuario('vitor_produtos5@teste.com')
  })

})
