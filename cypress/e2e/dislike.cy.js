describe('Like Button Interaction After Login', () => {
    beforeEach(() => {

      cy.visit('http://localhost:3000/login');
  
      cy.get('#\\:r1\\:').type('user@example.com'); // Using the actual email input box selector
      cy.get('#\\:r3\\:').type('SecurePassword123'); // Use the actual password input box selector
  
      cy.get('.MuiButton-contained').click();
  
      // Assertions can be added to verify that the jump to the home page was successful.
      // Ex:：cy.url().should('include', '/main');
    });
  
    it('allows a user to click the like button on the main page after login', () => {
      // Wait for the page to finish loading and make sure that the "Like" button has appeared!
      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [style="background-image: linear-gradient(to right, rgb(77, 178, 203), rgb(103, 178, 111)); border-radius: 8px; color: black;"]').click(); // 点击"喜欢"按钮
  
      // Add an assertion here to verify the expected behavior after clicking the "Like" button
      // For example, a change in the state of a validation button or a change in the text content of an element on a page
    });
    
  });
  