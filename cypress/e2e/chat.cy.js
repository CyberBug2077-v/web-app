describe('Main Page Interactions', () => {
    beforeEach(() => {
      // Access to the login page
      cy.visit('http://localhost:3000/login');
  
      // Fill out the login form
      cy.get('#\\:r1\\:').type('user@example.com');
      cy.get('#\\:r3\\:').type('SecurePassword123');
  
      // Click on the Login button
      cy.get('.MuiButton-contained').click();
  
      // Confirm that you have successfully jumped to the homepage
      cy.url().should('include', '/');
    });
  
    it('allows a user to like an item and send a message', () => {
      // Wait for the page to finish loading
      cy.wait(500); // The wait time may need to be adjusted according to the actual loading time of the page
  
      // Simulate clicking the Like button
      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [style="background-image: linear-gradient(to right, rgb(255, 98, 110), rgb(255, 190, 113)); border-radius: 8px; color: black;"]').click();
  
      // input text
      cy.get('#\\:r7\\:').type('Hi');
    });
});