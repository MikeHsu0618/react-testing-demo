

  describe('example to-do app', () => {
          // 實際訪問瀏覽器
          beforeEach(() => {
              cy.visit('http://localhost:3000')
          })
          // 模擬使用者型為並預期結果
          it('Login should have title', () => {
              cy.get('h1').first().should('have.text', 'Login')
              cy.get('form input').should('have.length', 2)
              cy.get('form button').should('have.length', 1)
          })
      }
  )