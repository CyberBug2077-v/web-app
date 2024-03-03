describe('Login and Registration Forms', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
  
    it('allows a user to input email and password', () => {
      cy.get('#\\:r1\\:').type('user@example.com');
      cy.get('#\\:r3\\:').type('password123');
      // Add any additional steps for submitting the form and asserting the expected outcome
    });
  
    // Add more tests for other fields and scenarios as needed
  });
  