describe('Create Sample', () => {
    it('successfully creates a sample', () => {
        cy.visit('http://localhost:5173/login');
        cy.get('input[name="username"]').type('testTeacher');
        cy.get('input[name="password"]').type('password123');
        cy.get('form').submit();

        cy.wait(2000);

        cy.intercept('POST', 'http://127.0.0.1:8000/api/create-classroom/').as('createClassroom');
        cy.intercept('POST', 'http://127.0.0.1:8000/api/create-sample/').as('createSample');

        cy.visit('http://localhost:5173/teacher-dashboard');

        cy.wait(1000);
        
        cy.get('a').contains('Create Classroom').click();


        cy.get('input[name="classroomName"]').type('testClassroom1');
        cy.get('input[name="classroomDescription"]').type('testDescription1');
        cy.get('input[type="radio"][value="NO"]').check();
        cy.get('input[type="radio"][value="TX"]').check();

        cy.get('button').contains('Create Classroom').click();

        cy.wait('@createClassroom').then((interception) => {
            const classroomId = interception.response.body.classroom_id;
            cy.visit(`http://localhost:5173/create-sample`, {
                state: { classroomId: classroomId }
            });

            cy.wait(2000);

            cy.get('input[name="sampleName"]').type('testSample1');
            cy.get('input[name="dataFile"]').attachFile('text_sample.csv');


            cy.get('button').contains('Create Sample').click();

            cy.wait(2000);

            cy.visit('http://localhost:5173/manage-classroom');


        });
    });
});
