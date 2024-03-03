describe('Registration Form', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('button').contains('Register').click();
  });

  it('allows a user to register with email, password, username, and description', () => {
    // Using the provided IDs for email, password, username, and description fields
    cy.get('#\\:r1\\:').type('user@example.com'); // Email input
    cy.get('#\\:r3\\:').type('SecurePassword123'); // Password input
    cy.get('#\\:r5\\:').type('newuser'); // Username input
    cy.get('#\\:r7\\:').type('This is a test user.'); // Description input

    // cy.get('input[type="file"]').attachFile('path/to/your/avatar.jpg');

    // Submit the form
    cy.get('.MuiButton-root').click(); // Or cy.get('button').contains('Register').click(); if it's through button click

    // Assert the expected outcome, like redirection to login page, success message, etc.

  });

});
