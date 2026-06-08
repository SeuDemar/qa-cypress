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

})
