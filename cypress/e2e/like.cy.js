describe('Like Button Interaction After Login', () => {
    beforeEach(() => {

      cy.visit('http://localhost:3000/login');
  

      cy.get('#\\:r1\\:').type('user@example.com'); // Using the actual email input box selector
      cy.get('#\\:r3\\:').type('SecurePassword123'); // Use the actual password input box selector
  
      cy.get('.MuiButton-contained').click();
  
    });
  
    it('allows a user to click the like button on the main page after login', () => {

      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [style="background-image: linear-gradient(to right, rgb(255, 98, 110), rgb(255, 190, 113)); border-radius: 8px; color: black;"]')
        .should('be.visible') // Make sure the button is visible
        .click(); // Click the "Like" button

    });
  
  });
  