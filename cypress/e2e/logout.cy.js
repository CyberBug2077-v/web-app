describe('Main Page Interactions', () => {
    beforeEach(() => {

        cy.visit('http://localhost:3000/login');

        cy.get('#\\:r1\\:').type('user@example.com');
        cy.get('#\\:r3\\:').type('SecurePassword123');

        cy.get('.MuiButton-contained').click();

        cy.url().should('include', '/');
    });

    it('allows a user to like an item, send a message, and use the search function', () => {
        // Wait for the page to finish loading
        cy.wait(500);

        // Simulate clicking the Like button
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > [style="background-image: linear-gradient(to right, rgb(255, 98, 110), rgb(255, 190, 113)); border-radius: 8px; color: black;"]').click();

        // input text
        cy.get('#\\:r7\\:').type('Hi');

        // Click the Send button
        cy.get('.css-k008qs > .MuiButtonBase-root').click();

        // Use the search box to enter information only
        cy.get('#\\:r5\\:').type('Hi');
        // Add assertion validation search functionality based on real-world application logic
    });

    it('allows a user to logout', () => {
        // Simulate clicking the logout button
        cy.get(':nth-child(5) > .MuiTypography-root').click();

        // Verify success to return to the login page
        
    });

});
