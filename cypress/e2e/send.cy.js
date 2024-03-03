describe('Main Page Interactions', () => {
    beforeEach(() => {

      cy.visit('http://localhost:3000/login');
  
      cy.get('#\\:r1\\:').type('user@example.com');
      cy.get('#\\:r3\\:').type('SecurePassword123');
  
      cy.get('.MuiButton-contained').click();
  
      cy.url().should('include', '/');
    });
  
    it('allows a user to like an item and send a message', () => {

      cy.wait(500);
  
      cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [style="background-image: linear-gradient(to right, rgb(255, 98, 110), rgb(255, 190, 113)); border-radius: 8px; color: black;"]').click();
  
      cy.get('#\\:r7\\:').type('Hi');
  
      cy.get('.css-k008qs > .MuiButtonBase-root').click();
  
    });
  
  });
  