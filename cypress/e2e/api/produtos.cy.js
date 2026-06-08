describe('Produtos - API', () => {

  it('Verificar que a API de produtos retorna status 200', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/produtos'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('produtos')
      expect(response.body.produtos).to.have.length.greaterThan(0)
    })
  })

  it('Verificar que a busca por nome filtra corretamente via API', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/produtos',
      qs: { nome: 'Logitech MX Vertical' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.be.greaterThan(0)
      expect(response.body.produtos[0].nome).to.eq('Logitech MX Vertical')
    })
  })

  it('Busca por produto inexistente retorna quantidade zero', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/produtos',
      qs: { nome: 'ProdutoQueNaoExiste99999' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(0)
      expect(response.body.produtos).to.have.length(0)
    })
  })

  it('Resposta da API de produtos contém campos obrigatórios', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/produtos'
    }).then((response) => {
      expect(response.status).to.eq(200)
      const produto = response.body.produtos[0]
      expect(produto).to.have.property('nome')
      expect(produto).to.have.property('preco')
      expect(produto).to.have.property('descricao')
      expect(produto).to.have.property('quantidade')
      expect(produto).to.have.property('_id')
    })
  })

})
