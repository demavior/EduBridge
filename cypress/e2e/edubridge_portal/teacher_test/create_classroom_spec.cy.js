describe('Create Classroom', () => {
    it('successfully creates a classroom', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[name="username"]').type('testTeacher');
        cy.get('input[name="password"]').type('password123');
        cy.get('form').submit();

        cy.wait(2000);
        
        cy.intercept('POST', 'http://127.0.0.1:8000/api/create-classroom/').as('createClassroom');
        
        cy.visit('http://localhost:5173/teacher-dashboard');

        cy.wait(1000);
        
        cy.get('a').contains('Create Classroom').click();


        cy.get('input[name="classroomName"]').type('testClassroom');
        cy.get('input[name="classroomDescription"]').type('testDescription');
        cy.get('input[type="radio"][value="NO"]').check();
        cy.get('input[type="radio"][value="TX"]').check();

        cy.get('button').contains('Create Classroom').click();

        cy.wait('@createClassroom').its('response.statusCode').should('eq', 201);   


        cy.visit('http://localhost:5173/create-sample');

    });
});
  