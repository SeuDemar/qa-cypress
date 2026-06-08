describe('Login - API', () => {

  it('Login com credenciais válidas retorna status 200 e token', () => {
    cy.cadastraUsuario('Vitor Login API', 'vitor_loginapi@teste.com', 'teste123', 'false')

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: { email: 'vitor_loginapi@teste.com', password: 'teste123' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('authorization')
      expect(response.body.authorization).to.include('Bearer')
    })

    cy.deleteUsuario('vitor_loginapi@teste.com')
  })

  it('Login com credenciais inválidas retorna status 401', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: { email: 'naoexiste@teste.com', password: 'senhaerrada' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(401)
      expect(response.body.message).to.eq('Email e/ou senha inválidos')
    })
  })

  it('Login sem body retorna status 400', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Token retornado no login é utilizável para autenticação', () => {
    cy.cadastraUsuario('Vitor Token', 'vitor_token@teste.com', 'teste123', 'true')

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/login',
      body: { email: 'vitor_token@teste.com', password: 'teste123' }
    }).then((loginResponse) => {
      const token = loginResponse.body.authorization

      cy.request({
        method: 'GET',
        url: 'https://serverest.dev/produtos',
        headers: { authorization: token }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    cy.deleteUsuario('vitor_token@teste.com')
  })

})
