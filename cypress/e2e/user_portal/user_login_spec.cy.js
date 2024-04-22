describe('User Login', () => {
    it('successfully logs in a user', () => {
      cy.visit('http://localhost:5173/login');


      cy.get('input[name="username"]').type('testTeacher');
      cy.get('input[name="password"]').type('password123');


      cy.intercept('POST', 'http://127.0.0.1:8000/user/login').as('loginUser');
  
      cy.get('form').submit();

      cy.wait(2000);
  
      cy.wait('@loginUser').its('response.statusCode').should('eq', 200);

      cy.visit('http://localhost:5173/teacher-dashboard');
    });
});
  