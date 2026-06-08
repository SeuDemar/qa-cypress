describe('Usuários - API', () => {
  beforeEach(() => {
    ['vitor_api_criar@teste.com', 'vitor_api_dup@teste.com', 'vitor_api_busca@teste.com', 'vitor_api_delete@teste.com'].forEach((email) => {
      cy.request({ method: 'GET', url: 'https://serverest.dev/usuarios', qs: { email } })
        .then((res) => { if (res.body.quantidade > 0) cy.deleteUsuario(email) })
    })
  })

  it('Listar usuários retorna status 200', () => {
    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.quantidade).to.be.greaterThan(0)
    })
  })

  it('Criar usuário retorna status 201', () => {
    cy.cadastraUsuario('Vitor API', 'vitor_api_criar@teste.com', 'teste123', 'false')

    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios',
      qs: { email: 'vitor_api_criar@teste.com' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.quantidade).to.eq(1)
    })

    cy.deleteUsuario('vitor_api_criar@teste.com')
  })

  it('Criar usuário com email duplicado retorna status 400', () => {
    cy.cadastraUsuario('Vitor API', 'vitor_api_dup@teste.com', 'teste123', 'false')

    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: { nome: 'Vitor API', email: 'vitor_api_dup@teste.com', password: 'teste123', administrador: 'false' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.message).to.eq('Este email já está sendo usado')
    })

    cy.deleteUsuario('vitor_api_dup@teste.com')
  })

  it('Criar usuário sem campos obrigatórios retorna status 400', () => {
    cy.request({
      method: 'POST',
      url: 'https://serverest.dev/usuarios',
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
    })
  })

  it('Buscar usuário por email retorna o usuário correto', () => {
    cy.cadastraUsuario('Vitor API Busca', 'vitor_api_busca@teste.com', 'teste123', 'false')

    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios',
      qs: { email: 'vitor_api_busca@teste.com' }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios[0].nome).to.eq('Vitor API Busca')
      expect(response.body.usuarios[0].email).to.eq('vitor_api_busca@teste.com')
    })

    cy.deleteUsuario('vitor_api_busca@teste.com')
  })

  it('Deletar usuário retorna status 200', () => {
    cy.cadastraUsuario('Vitor API Delete', 'vitor_api_delete@teste.com', 'teste123', 'false')

    cy.request({
      method: 'GET',
      url: 'https://serverest.dev/usuarios',
      qs: { email: 'vitor_api_delete@teste.com' }
    }).then((response) => {
      const id = response.body.usuarios[0]._id
      cy.request({
        method: 'DELETE',
        url: `https://serverest.dev/usuarios/${id}`
      }).then((deleteResponse) => {
        expect(deleteResponse.status).to.eq(200)
        expect(deleteResponse.body.message).to.eq('Registro excluído com sucesso')
      })
    })
  })

  it('Deletar usuário inexistente retorna status 200 com mensagem', () => {
    cy.request({
      method: 'DELETE',
      url: 'https://serverest.dev/usuarios/idquenaoexiste',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Nenhum registro excluído')
    })
  })

})
