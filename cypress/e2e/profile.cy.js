describe('Main Page Functionality', () => {
    beforeEach(() => {

      cy.visit('http://localhost:3000/login');
  
      cy.get('#\\:r1\\:').type('user@example.com');
      cy.get('#\\:r3\\:').type('SecurePassword123');

      cy.get('.MuiButton-contained').click();
      
    });
  
    it('should allow a user to interact with the main page after login', () => {
      // Simulate clicking on a user's avatar
      cy.get('.MuiAvatar-img').click();
  
    });
  
  });
  