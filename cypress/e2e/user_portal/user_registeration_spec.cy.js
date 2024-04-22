describe('User Registration', () => {
    it('should register a new user', () => {
        cy.visit('http://localhost:5173/register');
        cy.get('input[name="username"]').type('testTeacher');
        cy.get('input[name="email"]').type('testTeacher@hotmail.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('select[name="role"]').select('teacher');

        cy.intercept('POST', 'http://127.0.0.1:8000/user/register/').as('registerUser');

        cy.get('form').submit();

        cy.wait('@registerUser').its('response.statusCode').should('eq', 201);

        cy.visit('http://localhost:5173/login');

  });
});
